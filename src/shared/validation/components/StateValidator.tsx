import styles from "../css/validation.module.css";
import ValidationMessages from "./ValidationMessages";
import type { IValidator, ValidatorFunction } from "../interfaces/IValidation";
import { useStateValidator } from "../hooks/useStateValidator";
import { useValidatorContext } from "../hooks/useValidatorContext";

interface StateValidatorProps {
    children?: React.ReactNode | null;
    fieldName: string;
    state: any;
    validators: ValidatorFunction[];
    category?: string | null;
    validator?: IValidator | null;
    className?: string;
}

/**
 * Component to link to a state variable and provide validation.
 * @param state - The name of the input field as set in the child template.
 * @param validators - Validator functions to apply to the field.
 * @param validator - Optional. The validator to use. If not passed then useValidationContext will be called to get a validator instance.
 * @returns Wrapped children.
 */
const StateValidator: React.FC<StateValidatorProps> = ({
    children,
    fieldName,
    state,
    validators,
    category,
    validator,
    className
}) => {
    const contextValidator = useValidatorContext();
    validator = validator ?? contextValidator; // Use passed in validator, fall back to context

    const { validationResults, containerRef } = useStateValidator(
        fieldName,
        state,
        validators,
        validator,
        category
    );

    const validationErrorClass = validationResults.find(
        v => v.fieldName === fieldName.toUpperCase()
    )
        ? styles.field_input_validation_failed
        : "";

    return (
        <div
            className={[
                styles.field_validation_container,
                className,
                validationErrorClass
            ].join(" ")}
            ref={containerRef}
        >
            <ValidationMessages results={validationResults} maxNumItems={1} />
            {children}
        </div>
    );
};

export default StateValidator;