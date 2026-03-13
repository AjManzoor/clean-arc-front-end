import { useState } from "react";
import type { SortDirection } from "@mui/material";
import type { ITableWithPaginationAndSorting } from "../../../lib/list/listTypes";
import {APISortDirection, type ISortPropertyInfo,} from "../../../lib/list/sortingTypes";
import { useFetchExplicit } from "../../../lib/hooks/useFetchExplicit";
import { useEffectAfterMount } from "../../../lib/hooks/useEffectAfterMount";
import useTablePagination from "./useTablePagination";
import useTableSorting from "./useTableSorting";

export function useTableWithPaginationAndSorting<DataT, ExtraDataT = void>(
  url: string,
  pageSize: number,
  availableSortProperties: ISortPropertyInfo[],
  initialSortDirection: SortDirection,
  getQueryParams?: () => any,
  formatRow?: (row: any) => any,
  canQuery?: (params: any) => boolean
): ITableWithPaginationAndSorting<DataT, ExtraDataT> {
  const [data, setData] = useState<DataT[] | null>(null);
  const [extraData, setExtraData] = useState<ExtraDataT | null>(null);
  const [hasData, setHasData] = useState<boolean>(false);

  const pagination = useTablePagination(pageSize);
  const sort = useTableSorting(
    availableSortProperties,
    initialSortDirection ?? "desc"
  );
  const { data: rawData, isPending, error, fetchData } =
    useFetchExplicit<any>(url);

  const fetch = (resetPage?: boolean) => {
    let page = pagination.page;

    if (resetPage == true) {
      pagination.reset();
      page = 0;
    }

    const params = getQueryParams?.() ?? {};

    params.page = page;
    params.pageSize = pagination.rowsPerPage;

    if (availableSortProperties.length > 0) {
      params.sortPropertyName = sort.sortPropertyName;
      params.sortDirection =
        sort.sortDirection == "desc"
          ? APISortDirection.Descending
          : APISortDirection.Ascending;
    }

    const doFetch = !canQuery || canQuery(params);

    if (doFetch) {
      fetchData(params, "GET");
    }
  };

  const formatData = (data: any[]): any[] | null => {
    if (data == null) {
      return null;
    } else {
      return data.map((row: any) => formatRow?.(row) ?? row);
    }
  };

  useEffectAfterMount(() => {
    setData(rawData);
    setExtraData(null);
    setHasData(false);
    pagination.setRowsTotal(0);
  }, [rawData]);

  useEffectAfterMount(() => {
    const pagedResult = rawData as PagedQueryResult<DataT, ExtraDataT>;

    if (pagedResult) {
      setData(formatData(pagedResult.items));
      setExtraData(pagedResult.extraData ?? null);
      setHasData(pagedResult.items.length > 0);
      pagination.setRowsTotal(pagedResult.totalItems);
    } else {
      setData([]);
      setExtraData(null);
      setHasData(false);
      pagination.setRowsTotal(0);
    }
  }, [rawData]);

  useEffectAfterMount(() => {
    fetch();
  }, [pagination.page, sort.sortDirection, sort.sortPropertyName]);

  return {
    fetch,
    isPending,
    error,
    setData,
    data,
    extraData,
    hasData,
    isComplete: !!data,
    ...pagination,
    ...sort,
  };
}

interface PagedQueryResult<ItemT, ExtraDataT = void> {
  items: ItemT[];
  totalItems: number;
  extraData?: ExtraDataT | null;
}