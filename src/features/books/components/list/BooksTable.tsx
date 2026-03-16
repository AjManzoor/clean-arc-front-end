import useBooksTable from "../../hooks/list/useBooksTable";
import styles from "../../../shared/css/table.module.css";
import listStyles from "../../../shared/css/list.module.css"

import { Grid, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import SearchAsYouTypeBox from "../../../../shared/list/components/filters/SearchAsYouTypeBox";
import DivSpacer from "../../../../shared/generic/components/DivSpacer";
import AsyncStatus from "../../../../shared/generic/components/AsyncStatus";
import TableCellWithSorting from "../../../../shared/list/components/cells/TableCellWithSorting";
import type { BookItemResponse } from "../../interfaces/BookItemResponse";
import TablePagingControl from "../../../../shared/list/components/paging/TablePagingControl";

const BooksTable = () => {
    const booksTable = useBooksTable();
    return(
        <>
<Grid className={styles.home_container} id="home_container" container columns={12} >
  <Grid size={12} sx={{ minHeight: 200 }} className={listStyles.table_holder}>
    
    <Grid container size={12} className={listStyles.action_bar}>
      <SearchAsYouTypeBox id="book-search" label="search books" initialQuery={booksTable.searchQuery} onSearch={booksTable.setSearchQuery} disabled={booksTable.isPending}/>
    </Grid>

    <AsyncStatus status={booksTable.table} retry={booksTable.table.fetch}>
        <Grid size={12} sx={{ minHeight: 200 }}>
        <Table id="tbl-books" className={listStyles.nb_table}>
          
          <TableHead>
            <TableRow>
              <TableCellWithSorting sortingProvider={booksTable.table} propName="BookName" label="BookName"/>
              <TableCell>Author</TableCell>
              <TableCell>GenreId</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Fiction</TableCell>
              <TableCell>StartDate</TableCell>
             <TableCell>FinishDate</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {booksTable.table.data && booksTable.table.data.map((row : BookItemResponse, index: any)=>(
                <TableRow key={index}>
                  <TableCell>{row.bookName}</TableCell>
                  <TableCell>{row.author}</TableCell>
                  <TableCell>{row.genreId}</TableCell>
                  <TableCell>{row.rating}</TableCell>
                  <TableCell>{row.fiction}</TableCell>
                  <TableCell>{row.startDate}</TableCell>
                  <TableCell>{row.finishDate}</TableCell>

                </TableRow>
            ))}

          </TableBody>

        </Table>
        
        </Grid>

        <TablePagingControl table = {booksTable.table}/> 

    </AsyncStatus>

    <DivSpacer/>
  
  </Grid>
</Grid>

        </>
    )

}

export default BooksTable;