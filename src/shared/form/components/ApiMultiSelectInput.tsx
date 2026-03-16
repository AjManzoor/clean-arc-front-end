import { Box, Button } from "@mui/material";

import {
  type ApiMultiSelectInputProps,
  useApiMultiSelectInput
} from "../hooks/useApiMultiSelectInput";
import ApiMultiSelectPopup from "./ApiMultiSelectPoup";



const ApiMultiSelectInput = ({
  disabled = false,
  ...props
}: ApiMultiSelectInputProps) => {

  const popup = useApiMultiSelectInput(props);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexFlow: "row",
          gap: 1,
          alignItems: "center",
          maxWidth: props.maxWidth
        }}
      >
        <Button
          disabled={disabled}
          autoFocus
          fullWidth
          onClick={() => popup.setIsOpen(true)}
        >
          {popup.getButtonText()}
        </Button>
      </Box>

      <ApiMultiSelectPopup
        isOpen={popup.isOpen}
        onApply={popup.onApply}
        onCancel={popup.onCancel}
        value={props.value}
        autoCompleteOptions={props.autoCompleteOptions}
        renderSelectedItem={props.renderSelectedItem}
      />
    </>
  );
};

export default ApiMultiSelectInput;