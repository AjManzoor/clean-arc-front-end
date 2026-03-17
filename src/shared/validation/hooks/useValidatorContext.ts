import { useContext } from "react";
import type { IValidator } from "../interfaces/IValidation";
import { ValidatorContext } from "../../../contexts/validatorContext";

export function useValidatorContext(id?: string): IValidator {
    const context = useContext(ValidatorContext);

    if (!context) {
        throw new Error(
            "useValidatorContext must be used within a ValidatorContextProvider"
        );
    }

    if (id && context.id !== id) {
        throw new Error(`No ValidatorContext found with id: ${id}`);
    }

    return context;
}