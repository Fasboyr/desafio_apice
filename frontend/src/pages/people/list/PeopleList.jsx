import React, { useEffect, useState } from "react";
import style from "./PeopleList.module.css";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { Card } from 'primereact/card';
import { Link, useNavigate } from "react-router-dom";

const PeopleList = () => {
    const [people, setPeople] = useState([]);
    const navigate = useNavigate();

    const getPeople = async () => {
        try {
            const res = await axios.get("http://localhost:8800/people");
            setPeople(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        getPeople();
    }, []);

    const handleEdit = (item) => {
        navigate('/pform', { state: { item } }); 
    };
    

    const handleDelete = async (id) => {
        try {
            const { data } = await axios.delete("http://localhost:8800/people/" + id);
            setPeople(people.filter((person) => person.id !== id));
            toast.success(data);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <Card className={style.card}>
            <div className={style.cardHeader}>
                <div className={style.cardTitle}>Pessoas</div>
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
                                    <th className={style.th}>Nome</th>
                                    <th className={style.th}>Cidade</th>
                                    <th className={style.th}>Telefone</th>
                                    <th className={style.th}></th> {/* Coluna extra para os ícones */}
                                    <th className={style.th}></th> {/* Coluna extra para os ícones */}
                                </tr>
                            </thead>
                            <tbody className={style.tbody}>
                                {people.map((item, i) => (
                                    <tr key={i} className={style.tr}>
                                        <td className={`${style.td} ${style.widthId}`}>{item.id}</td>
                                        <td className={`${style.td} ${style.widthNome}`}>{item.nome}</td>
                                        <td className={`${style.td} ${style.widthCidade}`}>{item.cidade}</td>
                                        <td className={`${style.td} ${style.widthTelefone}`}>{item.telefone}</td>
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

export default PeopleList;
