import { useEffect, useRef, useState } from "react";
import type {
    IValidationField,
    IValidationResult,
    IValidationResultWithCategory,
    IValidator,
    ValidationChange,
    ValidatorFunction
} from "../interfaces/IValidation";

export const ValidateOnChangeBehaviour = {
    OnlyAfterFirstValidate: 0,
    Always: 1
} as const;

export type ValidateOnChangeBehaviour =
    typeof ValidateOnChangeBehaviour[keyof typeof ValidateOnChangeBehaviour];
    
export const useValidator = (
    changeBehaviour: ValidateOnChangeBehaviour = ValidateOnChangeBehaviour.OnlyAfterFirstValidate
): IValidator => {
    const [isPending, setIsPending] = useState<boolean>(false);
    const [isValid, setIsValid] = useState<boolean>(false);
    const [hasRun, setHasRun] = useState<boolean>(false);
    const [results, setResults] = useState<IValidationResultWithCategory[]>([]);

    // Internals
    const fieldMap = useRef<FieldValidatorMap[]>([]);
    const shouldValidate = useRef<boolean>(
        changeBehaviour === ValidateOnChangeBehaviour.Always
    );

    const doNormaliseFieldName = (fieldName: string): string => {
        return fieldName.trim().toUpperCase();
    };

    const toResultWithCategory = (
        result: IValidationResult,
        category: string | null
    ): IValidationResultWithCategory => {
        return { ...result, category };
    };

    const doValidateField = async (
        mapEntry: FieldValidatorMap
    ): Promise<IValidationResult[]> => {
        const promiseResults = await Promise.allSettled(
            mapEntry.validators.map(async fnVal => {
                const result = await fnVal(mapEntry.lastValue);
                result.fieldName = mapEntry.fieldName;
                return result;
            })
        );

        mapEntry.results = promiseResults
            .filter(
                pr => pr.status === "fulfilled" && pr.value.isValid === false
            )
            .map(pr => (pr as PromiseFulfilledResult<IValidationResult>).value);

        // Exclude failed promises & successful results
        if (mapEntry.changeCallback != null) {
            mapEntry.changeCallback(
                mapEntry.results.map(vr =>
                    toResultWithCategory(vr, mapEntry.category)
                )
            );
        }

        return mapEntry.results;
    };

    const doUpdateIsValid = () => {
        const allResults = fieldMap.current.flatMap(mapEntry =>
            mapEntry.results.map(vr =>
                toResultWithCategory(vr, mapEntry.category)
            )
        );

        const newIsValid = allResults.length === 0;

        setResults(allResults);
        setIsValid(newIsValid);
        setHasRun(shouldValidate.current);

        return {
            isValid: newIsValid,
            results: allResults
        };
    };

    // Interface
    const setFieldValidators = (
        fieldName: string,
        validators: ValidatorFunction[],
        initialValue: any,
        category: string | null = null,
        changeCallback: ValidationChange | null = null
    ): IValidationField => {
        fieldName = doNormaliseFieldName(fieldName);

        fieldMap.current = fieldMap.current.filter(a => a.fieldName !== fieldName);
        fieldMap.current = [
            ...fieldMap.current,
            {
                fieldName,
                validators,
                category,
                changeCallback,
                results: [],
                lastValue: initialValue
            }
        ];

        return {
            setValue: async (newValue: any): Promise<void> => {
                const mapEntry = fieldMap.current.find(
                    me => me.fieldName === fieldName
                );

                if (!mapEntry) {
                    throw new Error(
                        "Cannot call setValue() once dispose() has been called"
                    );
                }

                if (mapEntry.lastValue !== newValue) {
                    // Prevent change/render loops
                    mapEntry.lastValue = newValue;

                    if (shouldValidate.current === true) {
                        setIsPending(true);
                        await doValidateField(mapEntry);
                        setIsPending(false);
                    }

                    doUpdateIsValid();
                }
            },

            isDisposed: (): boolean => {
                return fieldMap.current.some(a => a.fieldName === fieldName) === false;
            },

            dispose: () => {
                fieldMap.current = fieldMap.current.filter(
                    a => a.fieldName !== fieldName
                );
                doUpdateIsValid();
            }
        };
    };

    const validate = async (
        validCallback: () => void,
        notValidCallback: ((results: IValidationResultWithCategory[]) => void) | null = null
    ): Promise<boolean> => {
        setIsPending(true);

        await Promise.allSettled(
            fieldMap.current.map(async (mapEntry: FieldValidatorMap) => {
                await doValidateField(mapEntry);
            })
        );

        shouldValidate.current = true;

        const results = doUpdateIsValid();

        if (results.isValid === true) {
            validCallback();
        } else if (notValidCallback != null) {
            notValidCallback(results.results);
        }

        setIsPending(false);

        return results.isValid;
    };

    const reset = () => {
        shouldValidate.current =
            changeBehaviour === ValidateOnChangeBehaviour.Always;
    };

    useEffect(() => {
        doUpdateIsValid();
    }, []);

    return {
        isPending,
        isValid,
        hasRun,
        results,
        setFieldValidators,
        validate,
        reset
    };
};

type FieldValidatorMap = {
    fieldName: string;
    validators: ValidatorFunction[];
    category: string | null;
    changeCallback: ValidationChange | null;
    results: IValidationResult[];
    lastValue: any;
};