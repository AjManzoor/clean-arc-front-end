import { useId } from "react";
import {
    Button,
    Checkbox,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    Select
} from "@mui/material";

import type { IFilterOption } from "../../../../lib/list/filterTypes";
import {
   type  MultiFilterProps,
    useMultiFilter
} from "../../hooks/filters/useMultiFilter";

import tableStyles from "../../../css/list.module.css"

const MultiFilter = (props: MultiFilterProps) => {
    const instanceId = useId();

    const {
        selectedValuesInternal,
        getRenderValue,
        apply,
        cancel,
        selectAll,
        clearAll,
        open,
        setOpen,
        handleOnCheckedChange,
        isOptionSelected,
        areAllSelectedInternal,
        hasSelection
    } = useMultiFilter(props);

    return (
        <FormControl
            className={tableStyles.filter_multi_holder}
            sx={{ minWidth: 150 }}
            size="small"
        >
            <InputLabel
                id={`${instanceId}-label`}
                className={tableStyles.filter_multi_label}
                shrink={true}
            >
                {props.label}
            </InputLabel>

            <Select
                className={tableStyles.filter_multi}
                labelId={`${instanceId}-label`}
                aria-label={props.tooltip}
                title={props.tooltip}
                multiple
                value={selectedValuesInternal as any}
                renderValue={getRenderValue}
                displayEmpty={true}
                open={open}
                onClose={cancel}
                onOpen={() => setOpen(true)}
                sx={{
                    ".MuiSelect-select": {
                        padding: 1.2
                    }
                }}
                disabled={props.disabled}
            >
                {props.filterOptions.map(
                    (option: IFilterOption<any>, idx: number) => (
                        <MenuItem
                            className={tableStyles.multi_dropdown}
                            key={option.value}
                            value={option.value}
                        >
                            <Checkbox
                                checked={isOptionSelected(option)}
                                onChange={(e) =>
                                    handleOnCheckedChange(e, option)
                                }
                                aria-labelledby={`${instanceId}-optionlabel-${idx}`}
                            />

                            <ListItemText
                                primary={option.name}
                                id={`${instanceId}-optionlabel-${idx}`}
                            />
                        </MenuItem>
                    )
                )}

                <div className={tableStyles.filter_action_bar}>
                    <Button
                        onClick={cancel}
                    >
                        Cancel
                    </Button>

                    <Button
                        //variant="dropdownActionButton"
                        onClick={selectAll}
                        disabled={areAllSelectedInternal}
                    >
                        Select All
                    </Button>

                    <Button
                        //variant="dropdownActionButton"
                        onClick={clearAll}
                        disabled={!hasSelection}
                    >
                        Clear All
                    </Button>

                    <Button
                       // variant="dropdownButton"
                        autoFocus
                        onClick={apply}
                        disabled={!hasSelection && props.setAllIfNoneSelected}
                    >
                        Apply
                    </Button>
                </div>
            </Select>
        </FormControl>
    );
};

export default MultiFilter;