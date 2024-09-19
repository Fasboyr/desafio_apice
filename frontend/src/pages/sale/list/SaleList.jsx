import React, { useEffect, useState } from "react";
import style from "./SaleList.module.css";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { Card } from 'primereact/card';
import { Link, useNavigate } from "react-router-dom";

const SalesList = () => {
    const [sales, setSales] = useState([]);
    const navigate = useNavigate();

    const getSales = async () => {
        try {
            const res = await axios.get("http://localhost:8800/sales");
            setSales(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        getSales();
    }, []);

    const handleEdit = (item) => {
        navigate('/pform', { state: { item } }); 
    };
    

    const handleDelete = async (id) => {
        try {
            const { data } = await axios.delete("http://localhost:8800/sales/" + id);
            setSales(sales.filter((sale) => sale.id !== id));
            toast.success(data);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <Card className={style.card}>
            <div className={style.cardHeader}>
                <div className={style.cardTitle}>Vendas</div>
            </div>
            <div className={style.buttonContainer}>
                <Link to="/pform" className={style.addButtonLink}>
                    <button className={style.addButton}>Adicionar</button>
                </Link>
            </div>
            <div className={style.outerContainer}>
                <div className={style.innerContainer}>
                    <div className={style.tableWrapper}>
                        <table className={style.table}>
                            <thead>
                                <tr>
                                    <th className={style.th}>Código</th>
                                    <th className={style.th}>Cliente</th>
                                    <th className={style.th}>Total de Venda (R$)</th>
                                    <th className={style.th}></th> {/* Coluna extra para os ícones */}
                                    <th className={style.th}></th> {/* Coluna extra para os ícones */}
                                </tr>
                            </thead>
                            <tbody className={style.tbody}>
                                {sales.map((item, i) => (
                                    <tr key={i} className={style.tr}>
                                        <td className={`${style.td} ${style.widthId}`}>{item.id}</td>
                                        <td className={`${style.td} ${style.widthNome}`}>{item.pessoa}</td>
                                        <td className={`${style.td} ${style.widthCidade}`}>{item.total_venda}</td>
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
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default SalesList;
