
import { Route, Routes } from 'react-router-dom';
import './App.css'
import BooksPage from './features/books/components/list/BooksPage';
import CreateBook from './features/books/components/create/CreateBook';


const App = () => {
  return (
    <>
        <Routes>
      <Route path="/Books" element={<BooksPage />} />
            <Route path="/AddBook" element={<CreateBook />} />

    </Routes>

    </>

  );
};

export default App;
