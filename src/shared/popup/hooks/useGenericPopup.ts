import { useState } from "react";

export const useGenericPopup = () => {
    const [open, setOpen] = useState(false);
    const [state, setState] = useState<any | null>(null)

    return{
        open, setOpen,
        state, setState
    }
}