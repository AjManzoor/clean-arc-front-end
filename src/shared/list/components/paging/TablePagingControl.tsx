import { TablePagination } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import listStyles from "../../../../shared/css/list.module.css";

import type { ITableWithPaginationAndSorting } from "../../../../lib/list/listTypes";

type TablePagingControlProps = {
  table: ITableWithPaginationAndSorting<any>;
};

type ActionsProps = {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: any, newPage: number) => void;
};

const TablePaginationActions = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
}: ActionsProps) => {
  const lastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);

  const handleFirst = (e: any) => onPageChange(e, 0);
  const handleLast = (e: any) => onPageChange(e, lastPage);
  const handlePrev = (e: any) => onPageChange(e, Math.max(0, page - 1));
  const handleNext = (e: any) => onPageChange(e, Math.min(lastPage, page + 1));
  const handleJumpBack5 = (e: any) => onPageChange(e, Math.max(0, page - 5));
  const handleJumpForward5 = (e: any) =>
    onPageChange(e, Math.min(lastPage, page + 5));

  return (
    <div className={listStyles.pagination_actions}>
      <IconButton
        onClick={handleFirst}
        disabled={page === 0}
        aria-label="first page"
      >
        «
      </IconButton>

      <IconButton
        onClick={handleJumpBack5}
        disabled={page === 0}
        aria-label="jump back 5"
      >
        ‹‹
      </IconButton>

      <IconButton
        onClick={handlePrev}
        disabled={page === 0}
        aria-label="previous page"
      >
        ‹
      </IconButton>

      <IconButton
        onClick={handleNext}
        disabled={page >= lastPage}
        aria-label="next page"
      >
        ›
      </IconButton>

      <IconButton
        onClick={handleJumpForward5}
        disabled={page >= lastPage}
        aria-label="jump forward 5"
      >
        ››
      </IconButton>

      <IconButton
        onClick={handleLast}
        disabled={page >= lastPage}
        aria-label="last page"
      >
        »
      </IconButton>
    </div>
  );
};

const TablePagingControl = ({ table }: TablePagingControlProps) => {
  return (
    <TablePagination
      className={listStyles.pagination}
      component="div"
      count={table.rowsTotal}
      page={table.page}
      onPageChange={table.handleChangePage}
      rowsPerPage={table.rowsPerPage}
      rowsPerPageOptions={[]}
      ActionsComponent={(actionsProps: any) => (
        <TablePaginationActions
          count={actionsProps.count}
          page={actionsProps.page}
          rowsPerPage={actionsProps.rowsPerPage}
          onPageChange={actionsProps.onPageChange}
        />
      )}
      showFirstButton={false}
      showLastButton={false}
    />
  );
};

export default TablePagingControl;