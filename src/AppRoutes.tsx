import {Routes, Route} from "react-router-dom";
import BooksPage from "./features/books/components/list/BooksPage";

export const AppRoutes = () =>{

    return(

        <>
        <Routes>
            <Route path ="/books" element={<><BooksPage/></>} />
        </Routes>
        </>
        


    )
}