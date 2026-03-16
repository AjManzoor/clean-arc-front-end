import { useState } from "react";

export const useGenericPopup = () => {
    const [open, isOpen] = useState(false);
    const [state, setState] = useState<any | null>(null)

    return{
        open, isOpen,
        state, setState
    }
}