import { useState } from "react";
import { useTableWithPaginationAndSorting } from "../../../shared/list/hooks/useTableWithPaginationAndSorting";
import type { BookItemResponse } from "../dtos/BookItemResponse";
import { useEffectAfterMount } from "../../../lib/hooks/useEffectAfterMount";
import { searchLogic } from "../../../lib/utils/searchUtils";
import { apiGetEndpoint } from "../../../lib/api/apiHelper";

const useBooksTable = () => {
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
    
    const table = useTableWithPaginationAndSorting<BookItemResponse>(apiGetEndpoint("books/paged"), 10, [], 'asc', getQueryParams)

    return{
        isPending : table.isPending, 
        error : table.error,
        table,
        searchQuery, setSearchQuery,
    }

}

export default useBooksTable;