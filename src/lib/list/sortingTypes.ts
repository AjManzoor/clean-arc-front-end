import type { SortDirection } from "@mui/material";

export interface ISortPropertyInfo {
  propertyName: string;
  displayName: string;
  rank: number;
}

export const APISortDirection = {
  Ascending: 0,
  Descending: 1
} as const;

export type APISortDirection =
  typeof APISortDirection[keyof typeof APISortDirection];

export interface ITableSortingProvider {
  sortPropertyName: string;
  sortDirection: SortDirection;

  getSort: (
    propertyName: string
  ) => { direction: "asc" | "desc" | undefined; active: boolean };

  setSort: (
    propertyNameToSortBy: string,
    directionToSortBy: SortDirection
  ) => void;

  toggleSort: (propertyName: string) => void;

  reset: () => void;
}