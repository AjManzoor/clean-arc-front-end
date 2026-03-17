import { useId, useState } from "react";

import {type  IMenuOption } from "../../../lib/lookups/types";
import type { IValidator } from "../../validation/interfaces/IValidation";

export function useFormActionButton(
    validator: IValidator,
    isPending?: boolean,
    onClick?: (() => void) | ((...args: any[]) => Promise<void>) | null,
    menuItems?: IMenuOption[] | null,
    data?: any | undefined
) {
    // IDs
    const menuId = useId();
    const buttonId = useId();

    // State
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const isOpen = Boolean(anchorEl);

    // Actions
    const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
        // We have menu items, so act like a menu
        if (!!menuItems) {
            setAnchorEl(event.currentTarget);
            return;
        }

        // We do not have menu items, so act like a button
        if (!!onClick && !validator!.isPending && !isPending) {
            onClick();
        }
    };

    const handleMenuItemClick = (entry: IMenuOption) => {
        if (!!entry.onClick) entry.onClick(data);

        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Interface
    return {
        menuId,
        buttonId,
        isOpen,
        anchorEl,
        handleButtonClick,
        handleMenuItemClick,
        handleClose
    };
}