import styles from './City.module.css';
import GlobalStyle from '../../styles/global.js';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect,useState } from 'react';
import axios from "axios";
import CityForm from '../../components/city/form/CityForm.jsx';
import CityGrid from '../../components/city/grid/CityGrid.jsx';



function  City() {
  const [cities, setCities] = useState([]);
  const [onEdit, setOnEdit] = useState(null);


  const getCities = async () => {
    try {
      const res = await axios.get("http://localhost:8800/cities");
      setCities(res.data.sort((a, b) => (a.id > b.id ? 1 : -1)));
    } catch (error) {
      toast.error(error.message);
    }
  };
  

  useEffect(() => {
    getCities();
  }, [setCities]);

  
  return (
    <>
      <div className={styles.container}>
        <h2>CIDADES</h2>
        <CityForm onEdit={onEdit} setOnEdit={setOnEdit} getCities={getCities}/>
        <CityGrid cities={cities} setCities={setCities} setOnEdit={setOnEdit}/>
      </div>
      <ToastContainer autoClose={3000} position="top-right" />
      <GlobalStyle />
    </>
  );
}

export default  City;
