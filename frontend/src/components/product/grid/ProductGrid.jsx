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

    const formatToCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };
    return (
        <table className={style.table}>
            <thead>
                <tr>
                    <th className={`${style.th} ${style.thId}`}>Código</th>
                    <th className={`${style.th} ${style.thNome}`}>Nome</th>
                    <th className={`${style.th} ${style.thValor}`}>Valor</th>
                </tr>
            </thead>
            <tbody className={style.tbody}>
                {products.map((item, i) => (
                    <tr key={i} className={style.tr}>
                        <td className={`${style.td} ${style.tdId}`}>{item.id}</td>
                        <td className={`${style.td} ${style.tdNome}`}>{item.nome}</td>
                        <td className={`${style.td} ${style.tdValor}`}>{formatToCurrency(item.vr_venda)}</td>
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
