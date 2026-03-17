import { useEffect, useRef, useState } from "react";
import type {
    IValidationField,
    IValidationResult,
    IValidator,
    ValidatorFunction
} from "../interfaces/IValidation";

export const useStateValidator = (
    fieldName: string,
    state: any,
    validators: ValidatorFunction[],
    validator: IValidator,
    category?: string | null
) => {
    const [validationResults, setValidationResults] = useState<IValidationResult[]>([]);
    const containerRef = useRef(null);

const valFieldRef = useRef<IValidationField | null>(null);

    useEffect(() => {
        valFieldRef.current = validator.setFieldValidators(
            fieldName,
            validators,
            state,
            category,
            setValidationResults
        );

        return () => {
            setValidationResults([]);
            valFieldRef.current?.dispose();
        };
    }, []);

    useEffect(() => {
        valFieldRef.current?.setValue(state).then();
    }, [state]);

    return {
        validationResults,
        containerRef
    };
};