
import { Route, Routes } from 'react-router-dom';
import './App.css'
import BooksPage from './features/books/components/list/BooksPage';


const App = () => {
  return (
    <>
        <Routes>
      <Route path="/Books" element={<BooksPage />} />
    </Routes>

    </>

  );
};

export default App;
