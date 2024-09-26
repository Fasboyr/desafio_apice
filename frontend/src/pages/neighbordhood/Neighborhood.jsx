import styles from './Neighborhood.module.css';
import GlobalStyle from '../../styles/global.js';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect,useState } from 'react';
import axios from "axios";
import NeighborhoodGrid from '../../components/neighborhood/grid/NeighborhoodGrid.jsx';
import NeighborhoodForm from '../../components/neighborhood/form/NeighborhoodForm.jsx';



function  Neighborhood() {
  const [hoods, setHoods] = useState([]);
  const [onEdit, setOnEdit] = useState(null);


  const getHoods = async () => {
    try {
      const res = await axios.get("http://localhost:8800/neighborhoods");
      setHoods(res.data.sort((a, b) => (a.id > b.id ? 1 : -1)));
    } catch (error) {
      toast.error(error);
    }


  };

  useEffect(() => {
    getHoods();
  }, [setHoods]);

  
  return (
    <>
      <div className={styles.container}>
        <h2>BAIRROS</h2>
        <NeighborhoodForm onEdit={onEdit} setOnEdit={setOnEdit} getHoods={getHoods}/>
        <NeighborhoodGrid neighborhoods={hoods} setHoods={setHoods} setOnEdit={setOnEdit}/>
      </div>
      <ToastContainer autoClose={3000} position="top-right" />
      <GlobalStyle />
    </>
  );
}

export default  Neighborhood;
