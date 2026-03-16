import { ListItemText, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import ApiMultiSelectInput from "../../../../shared/form/components/ApiMultiSelectInput";
import { useCreateBook } from "../../hooks/create/useCreateBook";
import { useState } from "react";
import { LookupType, type IAutoCompleteOption, type LookupValues } from "../../../../lib/lookups/types";
import { apiGetEndpoint } from "../../../../lib/api/apiHelper";
import type { AuthorItemResult } from "../../interfaces/types";
import MultiFilter from "../../../../shared/list/components/filters/Multifilter";
import { useEffectAfterMount } from "../../../../lib/hooks/useEffectAfterMount";
import { useFetch } from "../../../../lib/hooks/useFetch";
import { useListFilterOptions } from "../../../../shared/list/hooks/filters/useFilterOptions";
import lookupUtils from "../../../../lib/lookups/utils";

const CreateBook = () => {


    const create = useCreateBook();
    const [authorValue, setAuthorValue]= useState<IAutoCompleteOption[]>([]);
    const autoCompleteLenderQueryEndpoint = apiGetEndpoint("Author/Filter");
    const fetchLookups = useFetch<LookupValues[]>(apiGetEndpoint("Lookups"), {types : [LookupType.Genre]})
const genreFilter = useListFilterOptions<string>();

    useEffectAfterMount(()=> {

        genreFilter.setFilterOptions(lookupUtils.getValuesForTypeAsFilterOptions(fetchLookups.data ?? [], LookupType.Genre), false)

    }, [fetchLookups.data])

    const getAutoCompleteFetchParams = (query : string) => {

        return {filter : query, activeFilter : [1], maxItems: 10}
    }

    const autoCompleteMapToOptions = (enpointData : AuthorItemResult[]) : IAutoCompleteOption[] => {

        return enpointData.map(d => {return {value : d.id, label : d.name, rawValue: d}})
    }


    const handleAuthorChange = (newValue : IAutoCompleteOption[]) => {
        setAuthorValue(newValue)
    }

     const handleGenreChange = (newValue : string[]) => {
        genreFilter.setSelectedValues([...newValue])
    }

    return(
        <>

        <Box flex={1}>
            <MultiFilter
            label="Genres"
            tooltip="Genres find"
            filterOptions={genreFilter.filterOptions}
            selectedValues={genreFilter.selectedValues}
            onSelectedValuesChange={handleGenreChange}
            disabled={fetchLookups.isPending}/>

        </Box>


        <Box flex={1}>
    <Typography sx={{ mb: 1 }}>
        Author
    </Typography>

    <ApiMultiSelectInput
        maxWidth="12rem"
        value={authorValue}
        onChange={handleAuthorChange}
        autoCompleteOptions={{
            placeholder: "Search for a author...",
            queryEndpoint: autoCompleteLenderQueryEndpoint,
            getFetchParams: getAutoCompleteFetchParams,
            mapToOptions: autoCompleteMapToOptions,
            noOptionsText: "No author found",
            renderOption: (props, option) => (
                <li {...props} key={option.value}>
                    <ListItemText
                        primary={option.label}
                        secondary={option.rawValue?.name}
                    />
                </li>
            )
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
        </>
    )
}

export default CreateBook;