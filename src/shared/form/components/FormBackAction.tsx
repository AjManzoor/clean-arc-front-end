import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";


import { navigateUtils } from "../../../lib/utils/navUtils";
import FormActionButton from "./FormActionButton";

type FormBackActionProps = {
    label?: string;
    title?: string;
};

const FormBackAction = (props: FormBackActionProps) => {
    const navigate = useNavigate();

    return (
        <>
            {navigateUtils.canGoBackWithClose(window) && (
                <FormActionButton
                    label={props.label ?? "Back"}
                    title={props.title ?? "Back..."}
                    icon={<IoArrowBack size={28} ></IoArrowBack>}
                    onClick={() =>
                        navigateUtils.goBackWithClose(window, navigate)
                    }
                />
            )}
        </>
    );
};

export default FormBackAction;