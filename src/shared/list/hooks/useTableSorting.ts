import { useState } from "react";
import type { SortDirection } from "@mui/material";
import type {
  ISortPropertyInfo,
  ITableSortingProvider,
} from "../../../lib/list/sortingTypes";

export default function useTableSorting( availableSortProperties: ISortPropertyInfo[], defaultDirectionToSortBy: SortDirection)
: ITableSortingProvider 
{
  const defaultProperty = availableSortProperties.sort((first, second) => first.rank - second.rank)[0] ?? null;

  const [sortPropertyName, setSortPropertyName] = useState<string>(
    defaultProperty?.propertyName ?? null
  );
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(defaultDirectionToSortBy);

  const getSort = (
    propertyName: string
  ): { direction: "asc" | "desc" | undefined; active: boolean } => {
    return propertyName == sortPropertyName
      ? { direction: sortDirection as any, active: true }
      : { direction: undefined, active: false };
  };

  const setSort = (propertyNameToSortBy: string, directionToSortBy: SortDirection ) => {
    const isValidProperty = availableSortProperties.findIndex((sp) => sp.propertyName == propertyNameToSortBy) >= 0;

    if (!isValidProperty) return;

    setSortPropertyName(propertyNameToSortBy);
    setSortDirection(directionToSortBy);
  };

  // Toggle sort for the current column if it matches the passed-in column name
  // If column name does not match then the new sort column is set with the default sort direction
  const toggleSort = (propertyName: string) => {
    if (propertyName == sortPropertyName) {
      console.log(1)
      // Toggling current property
      setSortDirection(sortDirection == "asc" ? "desc" : "asc");
    } else {

      setSort(propertyName, defaultDirectionToSortBy);
    }
  };

  const reset = () => {
    if (!defaultProperty) return;

    setSort(defaultProperty.propertyName, defaultDirectionToSortBy);
  };

  return {
    sortPropertyName,
    sortDirection,
    getSort,
    setSort,
    toggleSort,
    reset,
  };
}