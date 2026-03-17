import styles from "../../layout/css/layout.module.css";
import type { IValidator } from "../interfaces/IValidation";
import { useFormWithValidator } from "../hooks/useFormWithValidator";
import GenericPopup from "../../popup/components/GenericPopup";
import FormValidationErrorPopup from "./FormValiationErrorPopup";

type FormWithValidatorProps = {
    children: React.ReactNode;
    onSubmit: ((...args: any[]) => Promise<void>) | (() => void);
    validator?: IValidator | null;
    showMessageOnInvalid?: boolean;
};

const FormWithValidator = ({
    children,
    onSubmit,
    validator,
    showMessageOnInvalid
}: FormWithValidatorProps) => {
    const form = useFormWithValidator(onSubmit, validator, showMessageOnInvalid);

    return (
        <>
            <form
                onSubmit={form.handleSubmit}
                className={styles.form_root}
                noValidate
            >
                {children}
            </form>

            {showMessageOnInvalid === true && (
                <GenericPopup
                    isOpen={form.valFailurePopup.open}
                    onClose={() => form.valFailurePopup.setOpen(false)}
                    paperSxProps={{ minWidth: "40vw", maxWidth: 600 }}
                >
                    <FormValidationErrorPopup
                        setOpen={form.valFailurePopup.setOpen}
                    />
                </GenericPopup>
            )}
        </>
    );
};

export default FormWithValidator;