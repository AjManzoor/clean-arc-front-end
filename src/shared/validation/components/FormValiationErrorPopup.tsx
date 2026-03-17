import { MdCancel } from "react-icons/md";
import styles from "../css/validation.module.css";
import DefaultPopup from "../../popup/components/DefaultPopup";

type FormValidationErrorPopupProps = {
    setOpen: (state: boolean) => void;
};

const FormValidationErrorPopup = ({ setOpen }: FormValidationErrorPopupProps) => {
    return (
        <DefaultPopup
            setOpen={setOpen}
            dialogTitle="Validation Issues"
            cancelButtonName="Close"
        >
            <div className={styles.validation_fail_holder}>
                <MdCancel
                    size={28}
                    className={styles.validation_fail_icon}
                />
                <p className={styles.validation_text}>
                    Unable to submit the form.
                </p>
                <p>
                    There are validation errors, please correct any errors and
                    then attempt to submit the form again.
                </p>
            </div>
        </DefaultPopup>
    );
};

export default FormValidationErrorPopup;