import styles from './App.module.css';
import styled from 'styled-components';
import GlobalStyle from './styles/global.js';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from './pages/neighbordhood/Hood.js';
import Grid from './components/Grid.js';
import { useEffect,useState } from 'react';
import axios from "axios";


const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h2``;

function App() {
  const [hoods, setHoods] = useState([]);
  const [onEdit, setOnEdit] = useState(null);


  const getHoods = async () => {
    try {
      const res = await axios.get("http://localhost:8800");
      setHoods(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
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
        <Title>BAIRROS</Title>
        <Form onEdit={onEdit} setOnEdit={setOnEdit} getHoods={getHoods}/>
        <Grid neighborhoods={hoods} setHoods={setHoods} setOnEdit={setOnEdit}/>
      </div>
      <ToastContainer autoClose={3000} position="bottom-left" />
      <GlobalStyle />
    </>
  );
}

export default App;
