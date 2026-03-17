import { Button, CircularProgress, Menu, MenuItem, Paper } from "@mui/material";

import { useValidatorContext } from "../../validation/hooks/useValidatorContext";
import type { IMenuOption } from "../../../lib/lookups/types";

import { useFormActionButton } from "../hooks/useFormActionButton";

import styles from "../../layout/css/layout.module.css";
import formStyles from "../css/form.module.css";
import { combineClassNames } from "../../utils";
import type { IValidator } from "../../validation/interfaces/IValidation";

type FormActionButtonProps = {
    label: string;
    subLabel?: string | null;
    onClick?: (() => void) | ((...args: any[]) => Promise<void>) | null;
    menuItems?: IMenuOption[] | null;
    isSubmit?: boolean;
    validator?: IValidator | null;
    isPending?: boolean;
    title?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    className?: string;
    innerClassName?: string;
    data?: any;
};

const FormActionButton = (props: FormActionButtonProps) => {
    const validator = props.validator ?? useValidatorContext(); // Use passed in validator, fall back to context
    const button = useFormActionButton(
        validator,
        props.isPending,
        props.onClick,
        props.menuItems,
        props.data
    );

    const innerClassNames = combineClassNames([
        formStyles.form_action_inner,
        props.innerClassName
    ]);

    // Template
    return (
        <>
            <Paper>
                <Button
                    type={props.isSubmit ? "submit" : "button"}
                    //variant="sideButton"
                    title={props.title}
                    disabled={
                        props.disabled === true ||
                        validator.isPending ||
                        props.isPending === true
                    }
                    onClick={button.handleButtonClick}
                    aria-controls={button.isOpen ? button.menuId : undefined}
                    aria-haspopup="true"
                    aria-expanded={button.isOpen ? "true" : undefined}
                    className={props.className}
                >
                    <div className={innerClassNames}>
                        {!!props.icon && !props.isPending && (
                            <span className={formStyles.form_action_icon}>
                                {props.icon}
                            </span>
                        )}

                        {props.isPending && (
                            <span className={formStyles.form_action_label}>
                                <CircularProgress size="1rem" />
                            </span>
                        )}

                        {!props.isPending && (
                            <span className={formStyles.form_action_label}>
                                {props.label}
                            </span>
                        )}

                        {!props.isPending && props.subLabel && (
                            <span className={formStyles.form_action_sub_label}>
                                {props.subLabel}
                            </span>
                        )}
                    </div>
                </Button>

                {!!props.menuItems && props.menuItems.length > 0 && (
                    <Menu
                        className={formStyles.form_action_menu}
                        id={button.menuId}
                        aria-labelledby={button.buttonId}
                        anchorEl={button.anchorEl}
                        open={button.isOpen}
                        onClose={button.handleClose}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        transformOrigin={{ vertical: "top", horizontal: "left" }}
                    >
                        <span className={styles.menu_dropdown}>
                            {props.menuItems.map((entry, index) => (
                                <MenuItem
                                    key={index}
                                    onClick={() =>
                                        button.handleMenuItemClick(entry)
                                    }
                                    title={entry.description}
                                >
                                    {entry.name}
                                </MenuItem>
                            ))}
                        </span>
                    </Menu>
                )}
            </Paper>
        </>
    );
};

export default FormActionButton;