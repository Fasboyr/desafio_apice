import React, { useEffect, useState } from "react";
import style from "./PeopleList.module.css";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { Card } from 'primereact/card';
import { Link, useNavigate } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";

const PeopleList = () => {
    const [people, setPeople] = useState([]);
    const [hoods, setHoods] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [selectedName, setSelectedName] = useState("");
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedHood, setSelectedHood] = useState(null);
    const navigate = useNavigate();

    const filterOptions = [
        { label: 'Parte do nome', value: 'name' },
        { label: 'Cidade', value: 'city' },
        { label: 'Bairro', value: 'neighborhood' }
    ];

    const getPeople = async () => {
        try {
            const res = await axios.get("http://localhost:8800/people");
            setPeople(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getHoods = async () => {
        try {
            const res = await axios.get("http://localhost:8800/neighborhoods");
            setHoods(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
        } catch (error) {
            toast.error(error);
        }
    };

    const getCities = async () => {
        try {
            const res = await axios.get("http://localhost:8800/cities");
            setCities(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
        } catch (error) {
            toast.error(error);
        }
    };

    useEffect(() => {
        getPeople();
        getHoods();
        getCities();
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

    const filterAndSortPeople = () => {
        let filteredPeople = [...people];

        console.log("Selected City:", selectedCity);
        console.log("People:", people);

        if (selectedFilter === 'name' && selectedName) {
            filteredPeople = filteredPeople.filter(person =>
                person.nome.toLowerCase().includes(selectedName.toLowerCase())
            );
        }

        if (selectedFilter === 'city' && selectedCity) {
            filteredPeople = filteredPeople.filter(person =>
                person.id_cidade === selectedCity 
            );
        }

        if (selectedFilter === 'neighborhood' && selectedHood) {
            filteredPeople = filteredPeople.filter(person =>
                person.id_bairro === selectedHood 
            );
        }

        return filteredPeople.sort((a, b) => (a.nome > b.nome ? 1 : -1));
    };

    return (
        <Card className={style.card}>
            <div className={style.cardHeader}>
                <div className={style.cardTitle}>Pessoas</div>
            </div>
            <div className={style.buttonContainer}>
                <div className={style.filterContainer}>
                    <div className={`${style.filterDropdown} ${selectedFilter === 'city' || selectedFilter === 'neighborhood' ? style.cityOrHoodFilter : style.noFilterOrNameActive}`}>
                        <Dropdown
                            id="filterDropdown"
                            value={selectedFilter}
                            options={filterOptions}
                            onChange={(e) => {
                                setSelectedFilter(e.value);
                                setSelectedCity(null);
                                setSelectedHood(null);
                                setSelectedName(""); 
                            }}
                            placeholder="Filtrar a lista por:"
                        />
                    </div>

                    {selectedFilter === 'name' && (
                        <div className={style.nameInputContainer}>
                            <InputText
                                type="text"
                                value={selectedName}
                                onChange={(e) => setSelectedName(e.target.value)}
                                placeholder="Digite o nome"
                                className={style.nameInput}
                            />
                        </div>
                    )}

                    {selectedFilter === 'city' && (
                        <div className={style.cityDropdown}>
                            <Dropdown
                                value={selectedCity}
                                options={cities.map(city => ({ label: city.nome, value: city.id }))}
                                onChange={(e) => setSelectedCity(e.value)}
                                placeholder="Selecione uma cidade"
                            />
                        </div>
                    )}

                    {selectedFilter === 'neighborhood' && (
                        <div className={style.neighborhoodDropdown}>
                            <Dropdown
                                value={selectedHood}
                                options={hoods.map(hood => ({ label: hood.nome, value: hood.id }))}
                                onChange={(e) => setSelectedHood(e.value)}
                                placeholder="Selecione um bairro"
                            />
                        </div>
                    )}
                </div>

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
                                    <th className={style.th}></th>
                                    <th className={style.th}></th>
                                </tr>
                            </thead>
                            <tbody className={style.tbody}>
                                {filterAndSortPeople().map((item, i) => (
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
