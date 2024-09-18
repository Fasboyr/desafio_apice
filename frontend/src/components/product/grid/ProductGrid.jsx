import React from "react";
import style from "./ProductGrid.module.css";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios"

const ProductGrid = ({ products, setProducts, setOnEdit }) => {

    const handleEdit = (item) => {
        setOnEdit(item);
    };


    const handleDelete = async (id) => {
        await axios
            .delete("http://localhost:8800/products/" + id)
            .then(({ data }) => {
                const newArray = products.filter((products) => products.id !== id);

                setProducts(newArray);
                toast.success(data);
            })
            .catch(({ data }) => toast.error(data));

        setOnEdit(null);
    };


    return (
        <table className={style.table}>
            <thead>
                <tr>
                    <th className={style.th}>Código</th>
                    <th className={style.th}>Nome</th>
                    <th className={style.th}>Valor</th>
                </tr>
            </thead>
            <tbody className={style.tbody}>
                {products.map((item, i) => (
                    <tr key={i} className={style.tr}>
                        <td className={`${style.td} ${style.width15}`}>{item.id}</td>
                        <td className={`${style.td} ${style.width30}`}>{item.nome}</td>
                        <td className={`${style.td} ${style.width30}`}>R$ {item.vr_venda}</td>
                        <td className={`${style.td} ${style.width5} ${style.alignCenter}`}>
                            <FaEdit onClick={() => handleEdit(item)} />
                        </td>
                        <td className={`${style.td} ${style.width5} ${style.alignCenter}`}>
                            <FaTrash onClick={() => handleDelete(item.id)} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ProductGrid;
