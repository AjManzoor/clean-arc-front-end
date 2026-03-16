import { Dialog, type SxProps } from "@mui/material";

type AlertDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    paperSxProps?: SxProps;
};

export default function GenericPopup({
    isOpen,
    onClose,
    children,
    paperSxProps
}: AlertDialogProps) {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{ sx: paperSxProps }}
        >
            {children}
        </Dialog>
    );
}

/*
*** EXAMPLE USAGE ***

const { open, setOpen } = useGenericPopup();

<GenericPopup isOpen={open} onClose={() => setOpen(false)}>
    <ConfirmAction
        setOpen={setOpen}
        dialogTitle={"Maaz Test Title"}
        dialogContentText={"Maaz Test Content Text"}
        cancelButtonName={"CANCEL"}
        proceedButtonName={"CONTINUE"}
        handleProceed={() => alert("Test Handle Proceed")}
    />
</GenericPopup>

<Button variant="contained" onClick={() => setOpen(true)}>
    ALERT TEST
</Button>
*/