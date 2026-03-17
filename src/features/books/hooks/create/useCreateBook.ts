import { useEffect, useState } from "react";
import { apiGetEndpoint } from "../../../../lib/api/apiHelper"
import { LookupType, type IAutoCompleteOption, type IDropdownOption, type LookupValues } from "../../../../lib/lookups/types";
import { useListFilterOptions } from "../../../../shared/list/hooks/filters/useFilterOptions";
import { useEffectAfterMount } from "../../../../lib/hooks/useEffectAfterMount";
import { useFetch } from "../../../../lib/hooks/useFetch";
import lookupUtils from "../../../../lib/lookups/utils";
import type { AuthorItemResult, ICreateBookRequest } from "../../interfaces/types";
import { useSubmitFormAction } from "../../../../shared/form/hooks/useSubmitFormAction";
import { FormSubmitAction } from "../../../../lib/interfaces/action/types";

export const useCreateBook = () => {

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

    const submitAction = useSubmitFormAction(
        apiGetEndpoint("Book"), 
        FormSubmitAction.Create,
        () => {
            const requestData : ICreateBookRequest = {

            }

            return requestData
        },
        () => location.replace("/books")
    );

    return{
        authorValue,
        genreFilter,
        autoCompleteLenderQueryEndpoint,
        fetchLookups,
        getAutoCompleteFetchParams,
        autoCompleteMapToOptions,
        handleAuthorChange,
        handleGenreChange,
        submitAction
    }

}