import type { IHasAsyncStatus } from "../interfaces/fetch/types";
import type { IdWithName } from "./idWithName";
import type { ITableSortingProvider } from "./sortingTypes";

export interface ITablePaginationSnapshot {
  readonly page: number;
  readonly rowsPerPage: number;
  readonly rowsTotal: number;
  readonly atFirstPage: boolean;
  readonly atLastPage: boolean;
}

export interface ITablePagination extends ITablePaginationSnapshot {
  setRowsTotal: (value: number) => void;
  reset: () => void;
  handleChangePage: (event: any, newPage: number) => void;
}

export interface ITableWithPaginationAndSorting<
  DataT,
  ExtraDataT = void
> extends ITablePagination,
    ITableSortingProvider,
    IHasAsyncStatus {
  fetch: (resetPage?: boolean) => void;
  readonly isPending: boolean;
  readonly error: string | null;

  setData: React.Dispatch<React.SetStateAction<any[] | null>>;

  readonly data: DataT[] | null;
  readonly extraData: ExtraDataT | null;
  readonly hasData: boolean;
}

export interface ICheckedItemList {
  isChecked: (id: string) => boolean;
  toggle: (item: IdWithName, checked: boolean) => void;

  selectedCount: number;
  selectedIds: string[];
  selectedItems: IdWithName[];

  clear: () => void;

  toggleAll: boolean;
  setToggleAll: React.Dispatch<React.SetStateAction<boolean>>;
  toggleAllItems: (items: IdWithName[]) => void;
}