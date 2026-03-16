import { Fragment } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import type { IAutoCompleteOption } from "../../../lib/lookups/types";

import type {
  ApiAutoCompleteCommonOptions,
} from "../types/types";
import { useApiAutoComplete } from "../hooks/useApiAutoComplete";

import loadingStyles from "../../generic/css/loadingError.module.css";

type ApiAutoCompleteProps = {
  fieldName: string;
  onChange: (value: string | null, option: IAutoCompleteOption | null) => void;
  labelId?: string;
  isOptionDisabled?: (
    value: string | null,
    option: IAutoCompleteOption | null
  ) => boolean;
  onInputChange?: () => void;
  disabled?: boolean;
  selectedValue?: IAutoCompleteOption | null;
};

const ApiAutoComplete = (
  props: ApiAutoCompleteProps & ApiAutoCompleteCommonOptions
) => {
  const autoComplete = useApiAutoComplete(
    props.onChange,
    props.queryEndpoint,
    props.mapToOptions,
    props.debounceWindowMs,
    undefined,
    undefined,
    props.getFetchParams
  );

  const doRenderOption = (
    liProps: React.HTMLAttributes<HTMLLIElement>,
    option: any
  ): React.ReactNode => {
    return props.renderOption!(liProps, option);
  };

  const doRenderOptionDefault = (
    liProps: React.HTMLAttributes<HTMLLIElement>,
    option: any
  ): React.ReactNode => {
    return (
      <li {...liProps} key={option.value}>
        {option.label}
      </li>
    );
  };

  const doGetOptionDisabled = (option: any): boolean => {
    return props.isOptionDisabled!(option.value, option);
  };

  return (
    <Autocomplete
      autoComplete
      fullWidth
      getOptionDisabled={
        !!props.isOptionDisabled ? doGetOptionDisabled : undefined
      }
      open={autoComplete.optionsAreOpen}
      onOpen={() => autoComplete.setOptionsAreOpen(true)}
      onClose={() => autoComplete.setOptionsAreOpen(false)}
      isOptionEqualToValue={autoComplete.isOptionEqualToValue}
      getOptionLabel={autoComplete.getOptionLabel}
      filterOptions={(x) => x}
      options={autoComplete.options}
      includeInputInList
      value={autoComplete.selectedValue}
      noOptionsText={props.noOptionsText}
      loading={autoComplete.isPending}
      disabled={props.disabled}
      onInputChange={(_event, newInputValue) => {
        autoComplete.setQueryValue(newInputValue);
        if (props.onInputChange) props.onInputChange();
      }}
      onChange={autoComplete.handleOnChange}
      renderOption={
        !!props.renderOption ? doRenderOption : doRenderOptionDefault
      }
      renderInput={(params) => (
        <TextField
          {...params}
          name={props.fieldName}
          aria-labelledby={props.labelId}
          placeholder={props.placeholder}
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {autoComplete.isPending ? (
                  <CircularProgress
                    className={loadingStyles.loader_icon_ac}
                    size={20}
                  />
                ) : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
    />
  );
};

export default ApiAutoComplete;