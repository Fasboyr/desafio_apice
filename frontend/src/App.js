import styles from './App.module.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import Neighborhood from './pages/neighbordhood/Neighborhood.jsx';
import City from './pages/city/City.jsx';
import PeopleList from './pages/people/list/PeopleList.jsx';
import PeopleForm from './pages/people/form/PeopleForm.jsx';
import Product from './pages/product/Product.jsx';
import SalesList from './pages/sale/list/SaleList.jsx';
import SalesForm from './pages/sale/form/SaleForm.jsx';
import Menu from './pages/menu/Menu.jsx';
import MenuLayout from './components/layout/menu/MenuLayout.jsx';
import DefaultLayout from './components/layout/default/DefaultLayout.jsx';

function App() {
  return (
    <div className={styles.appContainer}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MenuLayout><Menu /></MenuLayout>} />
          <Route path='/hood' element={<DefaultLayout><Neighborhood /></DefaultLayout>} />
          <Route path='/cities' element={<DefaultLayout><City /></DefaultLayout>} />
          <Route path='/people' element={<DefaultLayout><PeopleList /></DefaultLayout>} />
          <Route element={<DefaultLayout><PeopleForm /></DefaultLayout>} />
          <Route path='/products' element={<DefaultLayout><Product /></DefaultLayout>} />
          <Route path='/sales' element={<DefaultLayout><SalesList /></DefaultLayout>} />
          <Route element={<DefaultLayout><SalesForm /></DefaultLayout>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
