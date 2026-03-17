import type { IValidationResultWithCategory, IValidator } from "../interfaces/IValidation";
import { useGenericPopup } from "../../popup/hooks/useGenericPopup";
import { useValidatorContext } from "./useValidatorContext";

export const useFormWithValidator = (
    onSubmit: ((...args: any[]) => Promise<void>) | (() => void),
    validator?: IValidator | null,
    showMessageOnInvalid: boolean = true
) => {
    const contextValidator = useValidatorContext();
    validator = validator ?? contextValidator; // Use passed in validator, fall back to context

    const valFailurePopup = useGenericPopup();

    const onValidationFailed = (results: IValidationResultWithCategory[]) => {
        if (showMessageOnInvalid === true) {
            valFailurePopup.setOpen(true);
        }
    };

    // Interface
    const handleSubmit = (event: any) => {
        event.preventDefault();
        validator!.validate(onSubmit, onValidationFailed).then();
    };

    return {
        handleSubmit,
        valFailurePopup
    };
};