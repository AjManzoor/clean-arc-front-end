import { TableSortLabel, TableCell } from "@mui/material";
import type { ITableSortingProvider } from "../../../../lib/list/sortingTypes";

type TableCellWithSortingProps = {
  sortingProvider: ITableSortingProvider;
  propName: string;
  label: string;
};

const TableCellWithSorting = ({
  sortingProvider,
  propName,
  label,
}: TableCellWithSortingProps) => {

  const sort = sortingProvider.getSort(propName);

  return (
    <TableCell sortDirection={sort.direction}>
      <TableSortLabel
        active={sort.active}
        direction={sort.direction}
        onClick={() => sortingProvider.toggleSort(propName)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );
};

export default TableCellWithSorting;