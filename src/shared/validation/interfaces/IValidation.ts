export interface IValidationResult {
    isValid: boolean;
    message: string;
    fieldName?: string;
}

export interface IValidationResultWithCategory extends IValidationResult {
    category: string | null;
}

export type ValidatorFunction = (value: any) => Promise<IValidationResult>;

export type ValidationChange = (
    results: IValidationResultWithCategory[]
) => void;

export interface IValidationField {
    dispose: () => void;
    isDisposed: () => boolean;
    setValue: (newValue: string) => Promise<void>;
}

export interface IValidator {
    readonly isPending: boolean;
    readonly isValid: boolean;
    readonly hasRun: boolean;
    readonly results: IValidationResultWithCategory[];

    setFieldValidators(
        fieldName: string,
        validators: ValidatorFunction[],
        initialValue: any,
        category?: string | null,
        changeCallback?: ValidationChange | null
    ): IValidationField;

    validate(
        validCallback: () => void,
        notValidCallback?: ((results: IValidationResultWithCategory[]) => void) | null
    ): Promise<boolean>;

    reset: () => void;
}