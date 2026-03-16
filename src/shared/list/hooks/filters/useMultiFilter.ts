import { useEffect, useState } from "react";

import type { IFilterOption } from "../../../../lib/list/filterTypes";
import { LocalUserStorageConstants } from "../../../generic/constants/localUserStorageConstants";
import { useUserLocalStorage } from "../../../generic/hooks/useUserLocalStorage";

export interface MultiFilterProps {
    filterOptions: IFilterOption<any>[];
    selectedValues: any[];
    onSelectedValuesChange?: (selectedValues: any[]) => void;
    label: string;
    tooltip: string;
    localStorageId?: string;
    disabled?: boolean;
    setAllIfNoneSelected?: boolean;
}

export function useMultiFilter({
    setAllIfNoneSelected = true,
    ...props
}: MultiFilterProps) {
    const localUserStorage = useUserLocalStorage();

    // Selected values, written to on apply from selectedValuesInternal
    const [selectedValues, setSelectedValues] = useState(props.selectedValues);

    // Internal, updated as checkboxes are toggled
    const [selectedValuesInternal, setSelectedValuesInternal] = useState(
        props.selectedValues
    );

    const [areAllSelected, setAreAllSelected] = useState(
        props.selectedValues.length == props.filterOptions.length
    );

    const [areAllSelectedInternal, setAreAllSelectedInternal] = useState(
        props.selectedValues.length == props.filterOptions.length
    );

    const [hasSelection, setHasSelection] = useState(
        props.selectedValues.length > 0
    );

    // Dropdown open state
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const selectedValues =
            localUserStorage.getItem<string[]>(props.localStorageId ?? "") ??
            props.selectedValues;

        updateInternalSelection(selectedValues);
        updateSelectedValues(selectedValues);
    }, [props.selectedValues]);

    const updateInternalSelection = (newSelectedValues: string[]) => {
        setSelectedValuesInternal(newSelectedValues);
        setAreAllSelectedInternal(
            newSelectedValues.length == props.filterOptions.length
        );
        setHasSelection(newSelectedValues.length > 0);
    };

    const isOptionSelected = (option: IFilterOption<any>): boolean => {
        return selectedValuesInternal.indexOf(option?.value) >= 0;
    };

    const getSelectedOptions = (): IFilterOption<any>[] => {
        return props.filterOptions.filter(
            fo => selectedValues.indexOf(fo.value) >= 0
        );
    };

    const handleOnCheckedChange = (
        event: React.ChangeEvent,
        option: IFilterOption<any>
    ) => {
        const target: any = event.target;

        if (target.checked === true) {
            updateInternalSelection(selectedValuesInternal.concat([option.value]));
        } else {
            updateInternalSelection(
                selectedValuesInternal.filter(o => o !== option.value)
            );
        }
    };

    const selectAll = () => {
        updateInternalSelection(props.filterOptions.map(o => o.value));
    };

    const clearAll = () => {
        updateInternalSelection([]);
    };

    const updateSelectedValues = (newSelectedValues: any[]) => {
        if (newSelectedValues.length == 0 && setAllIfNoneSelected) {
            // No selection, default to "All"
            setAreAllSelected(true);
            setSelectedValues(props.filterOptions.map(o => o.value));
        } else {
            setAreAllSelected(
                newSelectedValues.length == props.filterOptions.length
            );
            setSelectedValues(newSelectedValues);
        }
    };

    const apply = () => {
        updateSelectedValues(selectedValuesInternal);

        if (props.onSelectedValuesChange) {
            props.onSelectedValuesChange(selectedValuesInternal);
        }

        if (props.localStorageId) {
            localUserStorage.setItem(
                `${LocalUserStorageConstants.userStorageWQFilterKey}.${props.localStorageId}`,
                selectedValuesInternal
            );
        }

        setOpen(false);
    };

    const cancel = () => {
        updateInternalSelection(selectedValues);
        setOpen(false);
    };

    const getRenderValue = () => {
        const selOptions = getSelectedOptions();

        if (areAllSelected == true) {
            return "All";
        } else if (selOptions.length == 1) {
            return selOptions[0].name;
        } else {
            return `${selOptions.length} applied`;
        }
    };

    return {
        selectedValuesInternal,
        areAllSelectedInternal,
        hasSelection,
        getRenderValue,
        apply,
        isOptionSelected,
        areAllSelected,
        selectAll,
        clearAll,
        handleOnCheckedChange,
        open,
        setOpen,
        cancel
    };
}