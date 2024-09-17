import styles from './App.module.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import DefaultLayout from './components/DefaultLayout.jsx';
import Neighborhood from './pages/neighbordhood/Neighborhood.jsx';
import City from './pages/city/City.jsx';
import PeopleList from './pages/people/list/PeopleList.jsx';
import PeopleForm from './pages/people/form/PeopleForm.jsx';



function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<DefaultLayout><Neighborhood /></DefaultLayout>} />
          <Route path='/cities' element={<DefaultLayout><City /></DefaultLayout>} />
          <Route path='/people' element={<DefaultLayout><PeopleList /></DefaultLayout>} />
          <Route path='/pform' element={<DefaultLayout><PeopleForm /></DefaultLayout>} />
        </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;
