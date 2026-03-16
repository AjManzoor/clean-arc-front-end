import { useState } from "react";
import type { Property } from "csstype";

import type { IAutoCompleteOption } from "../../../lib/lookups/types";
import type {
  ApiAutoCompleteCommonOptions,
  AutoCompleteResultItemRenderCallback
} from "../types/types";


export type ApiMultiSelectInputProps = {
  value: IAutoCompleteOption[] | null;
  onChange: (value: IAutoCompleteOption[]) => void;
  autoCompleteOptions: ApiAutoCompleteCommonOptions;
  renderSelectedItem?: AutoCompleteResultItemRenderCallback;
  maxWidth?: Property.MaxWidth;
  disabled?: boolean;
};


export function useApiMultiSelectInput(props: ApiMultiSelectInputProps) {

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const getButtonText = () => {
    return (!props.value || props.value.length === 0)
      ? "None Selected"
      : `${props.value.length} Selected`;
  };

  const onApply = (newValue: IAutoCompleteOption[]) => {
    setIsOpen(false);
    props.onChange(newValue);
  };

  const onCancel = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    setIsOpen,
    getButtonText,
    onApply,
    onCancel
  };
}