import { useState } from "react";
import { useTableWithPaginationAndSorting } from "../../../../shared/list/hooks/useTableWithPaginationAndSorting";
import type { BookItemResponse } from "../../interfaces/BookItemResponse";
import { useEffectAfterMount } from "../../../../lib/hooks/useEffectAfterMount";
import { searchLogic } from "../../../../lib/utils/searchUtils";
import { apiGetEndpoint } from "../../../../lib/api/apiHelper";
import type { ISortPropertyInfo } from "../../../../lib/list/sortingTypes";

const useBooksTable = () => {
    const propertiesToSortBy : ISortPropertyInfo[] = [{propertyName : "BookName", displayName : "BookName", rank : 0}]
    const [searchQuery, setSearchQuery] = useState<string>("");

    const getQueryParams = (): any => {
        return{
            filter : searchQuery
        }
    }
    useEffectAfterMount(() => {
        if(searchLogic.hasValidQuery(searchQuery)){
            table.fetch(true)
        }

    }, [searchQuery])
    
    const table = useTableWithPaginationAndSorting<BookItemResponse>(apiGetEndpoint("books/paged"), 10, propertiesToSortBy, 'asc', getQueryParams)

    return{
        isPending : table.isPending, 
        error : table.error,
        table,
        searchQuery, setSearchQuery,
    }

}

export default useBooksTable;