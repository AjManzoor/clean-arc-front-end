import {
    Button,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";

type DefaultPopupProps = {
    setOpen: (open: boolean) => void;
    dialogTitle: string;
    cancelButtonName: string;

    proceedButtonName?: string;
    handleProceed?: () => void;
    dialogContentText?: string;
    children?: React.ReactNode;
};

export default function DefaultPopup({
    setOpen,
    dialogTitle,
    dialogContentText,
    children,
    cancelButtonName,
    proceedButtonName,
    handleProceed
}: DefaultPopupProps) {

    return (
        <>
            <DialogTitle id="alert-dialog-title">
                {dialogTitle}
            </DialogTitle>

            <DialogContent>
                {!!dialogContentText && (
                    <DialogContentText>
                        {dialogContentText}
                    </DialogContentText>
                )}

                <br />

                {children}
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={() => setOpen(false)}
                >
                    {cancelButtonName}
                </Button>

                {!!proceedButtonName && !!handleProceed && (
                    <Button
                        onClick={handleProceed}
                        autoFocus
                    >
                        {proceedButtonName}
                    </Button>
                )}
            </DialogActions>
        </>
    );
}