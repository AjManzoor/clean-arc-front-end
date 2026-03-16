import { useEffect, useState } from "react";

import type { IAutoCompleteOption } from "../../../lib/lookups/types";

import type {
    ApiAutoCompleteCommonOptions,
    AutoCompleteResultItemRenderCallback
} from "../types/types";


export type ApiMultiSelectPopupProps = {
    isOpen: boolean;
    value: IAutoCompleteOption[] | null;
    onApply: (value: IAutoCompleteOption[]) => void;
    onCancel: () => void;
    autoCompleteOptions: ApiAutoCompleteCommonOptions;
    renderSelectedItem?: AutoCompleteResultItemRenderCallback;
};


export function useApiMultiSelectPopup(
    props: ApiMultiSelectPopupProps
) {

    // State
    const [selectedOptions, setSelectedOptions] = useState<IAutoCompleteOption[]>([]);


    // Functions
    const handleSearchSelection = (
        _value: string | null,
        option: IAutoCompleteOption | null
    ) => {

        if (!option?.rawValue || isOptionAlreadySelected(option.rawValue))
            return;

        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions.push({
            value: option.value,
            label: option.label,
            rawValue: option.rawValue
        });

        setSelectedOptions(newSelectedOptions);
    };


    const isOptionAlreadySelected = (
        option: IAutoCompleteOption | null
    ) => {
        if (!option)
            return false;

        return !!selectedOptions.find(o => o.value === option.value);
    };


    const handleSelectionRemove = (id: string) => {
        const newSelectedOptions = [...selectedOptions]
            .filter(o => o.value !== id);

        setSelectedOptions(newSelectedOptions);
    };


    // Events
    // Restore selection on value change or open
    useEffect(() => {
        if (props.isOpen && props.value) {
            setSelectedOptions([...props.value]);
        }
    }, [props.isOpen, props.value]);


    // Interface
    return {
        selectedOptions,
        handleSearchSelection,
        isOptionAlreadySelected,
        handleSelectionRemove
    };

}