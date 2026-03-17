import { Grid, ListItemText, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import ApiMultiSelectInput from "../../../../shared/form/components/ApiMultiSelectInput";
import { useCreateBook } from "../../hooks/create/useCreateBook";
import MultiFilter from "../../../../shared/list/components/filters/Multifilter";
import StateValidator from "../../../../shared/validation/components/StateValidator";
import { useFormScopedId } from "../../../../shared/form/hooks/useFormScopedId";
import ValidatorFunctions from "../../../../shared/validation/utils/validatorFunctions";
import { ValidatorContextProvider } from "../../../../contexts/validatorContext";
import { ValidateOnChangeBehaviour } from "../../../../shared/validation/hooks/useValidator";
import FormWithValidator from "../../../../shared/validation/components/FormWithValidation";
import styles from "../../../../shared/layout/css/layout.module.css";
import { MdSave } from "react-icons/md";
import FormBackAction from "../../../../shared/form/components/FormBackAction";
import FormActionButton from "../../../../shared/form/components/FormActionButton";


const CreateBook = () => {
  const { getFieldId, getFieldName, scopeName } = useFormScopedId("addBoook");

  const create = useCreateBook();

  return (
    <>
      <ValidatorContextProvider
        changeBehaviour={ValidateOnChangeBehaviour.OnlyAfterFirstValidate}
      >
        <FormWithValidator
          onSubmit={create.submitAction.submit}
          showMessageOnInvalid={true}
        >
          <Stack direction="row" spacing={3}>
            <StateValidator
              fieldName="genre-valiadtor"
              category={scopeName}
              validators={[ValidatorFunctions.notEmpty()]}
              state={create.genreFilter.selectedValue}
            >
              <Box flex={1}>
                <MultiFilter
                  label="Genres"
                  tooltip="Filter by genre"
                  filterOptions={create.genreFilter.filterOptions}
                  selectedValues={create.genreFilter.selectedValues}
                  onSelectedValuesChange={create.handleGenreChange}
                  disabled={create.fetchLookups.isPending}
                />
              </Box>
            </StateValidator>

            <Box flex={1}>
              <Typography sx={{ mb: 1 }}>Author</Typography>

              <ApiMultiSelectInput
                maxWidth="12rem"
                value={create.authorValue}
                onChange={create.handleAuthorChange}
                autoCompleteOptions={{
                  placeholder: "Search for an author...",
                  queryEndpoint: create.autoCompleteLenderQueryEndpoint,
                  getFetchParams: create.getAutoCompleteFetchParams,
                  mapToOptions: create.autoCompleteMapToOptions,
                  noOptionsText: "No author found",
                  renderOption: (props, option) => (
                    <li {...props} key={option.value}>
                      <ListItemText
                        primary={option.label}
                        secondary={option.rawValue?.name}
                      />
                    </li>
                  ),
                }}
                renderSelectedItem={(labelId, option) => (
                  <ListItemText
                    id={labelId}
                    primary={option.label}
                    secondary={option.rawValue?.description}
                  />
                )}
              />
            </Box>

            <Grid
              container
              columns={1}
              columnSpacing={2}
              rowSpacing={1}
              className={
                styles.detail_container + " " + styles.sidebar_buttons_holder
              }
            >
              <Grid>
                <FormBackAction />
              </Grid>

              <Grid>
                <FormActionButton
                  label="Submit"
                  isSubmit={true}
                  icon={<MdSave fontSize="large"></MdSave>}
                />
              </Grid>
            </Grid>
          </Stack>
        </FormWithValidator>
      </ValidatorContextProvider>
    </>
  );
};

export default CreateBook;
