import {
  Button,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { useFormScopedId } from "../hooks/useFormScopedId";

import ApiAutoComplete from "./ApiAutoComplete";
import {
  type ApiMultiSelectPopupProps,
  useApiMultiSelectPopup,
} from "../hooks/useApiMultiSelectPopup";
import GenericPopup from "../../popup/components/GenericPopup";

const ApiMultiSelectPopup = (props: ApiMultiSelectPopupProps) => {
  // State
  const { getFieldId, getFieldName } = useFormScopedId("ApiMultiSelectPopup");
  const popup = useApiMultiSelectPopup(props);

  // Options
  const doRenderOption = (
    labelId: string,
    option: any
  ): React.ReactNode => {
    return props.renderSelectedItem!(labelId, option);
  };

  const doRenderOptionDefault = (
    labelId: string,
    option: any
  ): React.ReactNode => {
    return <ListItemText id={labelId} primary={option.label} />;
  };

  // Template
  return (
    <GenericPopup
      isOpen={props.isOpen}
      onClose={() => {}}
      paperSxProps={{ minWidth: "30vw", maxWidth: 400 }}
    >
      <>
        <DialogContent>
          <ApiAutoComplete
            fieldName={getFieldName("search")}
            labelId={getFieldId("search")}
            mapToOptions={props.autoCompleteOptions.mapToOptions}
            placeholder={props.autoCompleteOptions.placeholder}
            noOptionsText={props.autoCompleteOptions.noOptionsText}
            queryEndpoint={props.autoCompleteOptions.queryEndpoint}
            getFetchParams={props.autoCompleteOptions.getFetchParams}
            onChange={popup.handleSearchSelection}
            renderOption={props.autoCompleteOptions.renderOption}
            isOptionDisabled={(_v, option) =>
              popup.isOptionAlreadySelected(option)
            }
          />

          <List sx={{ width: "100%" }}>
            {popup.selectedOptions.map((option) => {
              const labelId = `selected-list-label-${option.value}`;

              return (
                <ListItem key={option.value} disablePadding title="Remove">
                  <ListItemButton
                    role={undefined}
                    onClick={() => popup.handleSelectionRemove(option.value)}
                    dense
                  >
                    <ListItemIcon title="Remove">
                     { /*/<ClearIcon />*/}
                     <span > ✕ </span>
                    </ListItemIcon>

                    {!!props.renderSelectedItem
                      ? doRenderOption(labelId, option)
                      : doRenderOptionDefault(labelId, option)}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={props.onCancel}
            autoFocus
          >
            Cancel
          </Button>

          <Button
            onClick={() => props.onApply(popup.selectedOptions)}
            autoFocus
          >
            Apply
          </Button>
        </DialogActions>
      </>
    </GenericPopup>
  );
};

export default ApiMultiSelectPopup;