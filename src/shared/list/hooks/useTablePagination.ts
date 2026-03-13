import { useEffect, useState } from "react";
import type { ITablePagination } from "../../../lib/list/listTypes";

export default function useTablePagination(pageSize: number): ITablePagination {
  // State
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, _setRowsPerPage] = useState<number>(pageSize);
  const [rowsTotal, setRowsTotal] = useState<number>(0);

  const [atFirstPage, setAtFirstPage] = useState<boolean>(true);
  const [atLastPage, setAtLastPage] = useState<boolean>(true);

  const handleChangePage = (_event: any, newPage: number) => {
    setPage(newPage);
  };

  const reset = () => {
    setPage(0);
  };

  // Event handlers
  useEffect(() => {
    setAtFirstPage(page === 0);
    setAtLastPage(rowsPerPage * (page + 1) >= rowsTotal);
  }, [page, rowsPerPage, rowsTotal]);

  // Return interface
  return {
    page,
    rowsPerPage,
    rowsTotal,
    setRowsTotal,
    reset,
    handleChangePage,
    atFirstPage,
    atLastPage,
  };
}