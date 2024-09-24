import styles from './Product.module.css';
import GlobalStyle from '../../styles/global.js';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect,useState } from 'react';
import axios from "axios";
import ProductForm from '../../components/product/form/ProductForm.jsx';
import ProductGrid from '../../components/product/grid/ProductGrid.jsx';



function  Product() {
  const [products, setProducts] = useState([]);
  const [onEdit, setOnEdit] = useState(null);


  const getProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8800/products");
      setProducts(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
    } catch (error) {
      toast.error(error);
    }


  };

  useEffect(() => {
    getProducts();
  }, [setProducts]);

  
  return (
    <>
      <div className={styles.container}>
        <h2>PRODUTOS</h2>
        <ProductForm onEdit={onEdit} setOnEdit={setOnEdit} getProducts={getProducts}/>
        <ProductGrid products={products} setProducts={setProducts} setOnEdit={setOnEdit}/>
      </div>
      <ToastContainer autoClose={3000} position="top-right" />
      <GlobalStyle />
    </>
  );
}

export default  Product;
