import { IconButton, InputAdornment, TextField } from "@mui/material";
import {
  type SearchAsYouTypeBoxProps,
  useSearchAsYouTypeBox,
} from "../../hooks/filters/useSearchAsYouTypeBox";

import listStyles from "../../../../shared/css/list.module.css";

const SearchAsYouTypeBox = (props: SearchAsYouTypeBoxProps) => {
  const {
    handleQueryValueChange,
    getLabel,
    getPlaceholder,
    internalQueryValue,
    clear,
    queryValue,
  } = useSearchAsYouTypeBox(props);

  return (
    <div className={listStyles.search_bar}>
      <TextField
        id={props.id}
        size="small"
        value={internalQueryValue}
        label={getLabel()}
        placeholder={getPlaceholder()}
        onChange={(e) => handleQueryValueChange(e.target.value)}
        disabled={props.disabled}
        className={props.className}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                disabled={queryValue.length === 0}
                onClick={clear}
                color="secondary"
                aria-label="clear search"
              >
                ×
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default SearchAsYouTypeBox;