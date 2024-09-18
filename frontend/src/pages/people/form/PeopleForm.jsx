import React, { useEffect, useState } from "react";
import styles from "./PeopleForm.module.css";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Card } from "primereact/card";
import { Link, useLocation } from "react-router-dom";

const PeopleForm = () => {

    const location = useLocation();
    const [hoods, setHoods] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedHood, setSelectedHood] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        nome: '',
        id_cidade: '',
        id_bairro: '',
        cidade: '',
        bairro: '',
        cep: '',
        endereco: '',
        numero: '',
        complemento: '',
        telefone: '',
        email: ''
    });

    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        getHoods();
        getCities();
    }, []);

    useEffect(() => {
        if (location.state && location.state.item) {
            const item = location.state.item;
            setFormData({
                id: item.id,
                nome: item.nome,
                cidade: item.cidade,
                bairro: item.bairro,
                cep: item.cep,
                endereco: item.endereco,
                numero: item.numero,
                complemento: item.complemento,
                telefone: item.telefone,
                email: item.email
            });

            setIsEdit(true);

            const updateSelectedValues = () => {
                setSelectedCity(cities.find(city => city.id === item.id_cidade) || null);
                setSelectedHood(hoods.find(hood => hood.id === item.id_bairro) || null);

            };
            updateSelectedValues();
        } else {
            setIsEdit(false);
        }
    }, [location.state, cities, hoods]);

    const getHoods = async () => {
        try {
            const res = await axios.get("http://localhost:8800/neighborhoods");
            setHoods(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getCities = async () => {
        try {
            const res = await axios.get("http://localhost:8800/cities");
            setCities(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !formData.nome ||
            !(selectedCity || formData.id_cidade) ||
            !(selectedHood || formData.id_bairro) ||
            !formData.cep ||
            !formData.endereco ||
            !formData.numero ||
            !formData.complemento ||
            !formData.telefone ||
            !formData.email
        ) {
            return toast.warn("Preencha todos os campos!");

        }

        try {
            const cityId = selectedCity.id;
            const hoodId = selectedHood.id;
            if (isEdit) {
                await axios.put("http://localhost:8800/people/" + formData.id, {
                    id: formData.id,
                    nome: formData.nome,
                    id_cidade: cityId,
                    id_bairro: hoodId,
                    cep: formData.cep,
                    endereco: formData.endereco,
                    numero: formData.numero,
                    complemento: formData.complemento,
                    telefone: formData.telefone,
                    email: formData.email
                });
                toast.success("Pessoa atualizada com sucesso.");
            } else {
                await axios.post("http://localhost:8800/people", {
                    id: formData.id,
                    nome: formData.nome,
                    id_cidade: cityId,
                    id_bairro: hoodId,
                    cep: formData.cep,
                    endereco: formData.endereco,
                    numero: formData.numero,
                    complemento: formData.complemento,
                    telefone: formData.telefone,
                    email: formData.email
                });
                toast.success("Pessoa adicionada com sucesso.");
            }

            setFormData({
                id: '',
                nome: '',
                cidade: '',
                bairro: '',
                cep: '',
                endereco: '',
                numero: '',
                complemento: '',
                telefone: '',
                email: ''
            });
            setSelectedCity(null);
            setSelectedHood(null);
            setIsEdit(false);

        } catch (error) {
            toast.error("Ocorreu um erro ao salvar os dados.");
        }
    };
    return (
        <Card className={styles.card} title={<div className={styles.cardTitle}>Cadastro de Pessoas</div>}>
            <form className={styles.formContainer} onSubmit={handleSubmit}>
                <div className={styles.inputRow}>
                    <div className={`${styles.inputArea} ${styles.inputAreaId}`}>
                        <label>Código</label>
                        <InputText
                            className={`${styles.input} ${styles.inputId}`}
                            name="id"
                            value={formData.id || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={`${styles.inputArea} ${styles.inputAreaNome}`}>
                        <label>Nome</label>
                        <InputText
                            className={`${styles.input} ${styles.inputNome}`}
                            name="nome"
                            value={formData.nome || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={`${styles.inputArea} ${styles.inputAreaTelefone}`}>
                        <label>Telefone</label>
                        <InputText
                            className={styles.input}
                            name="telefone"
                            value={formData.telefone || ""}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className={styles.inputRow}>
                    <div className={`${styles.inputArea} ${styles.inputAreaCidade}`}>
                        <label>Cidade</label>
                        <Dropdown
                            value={selectedCity}
                            options={cities}
                            onChange={(e) => setSelectedCity(e.value)}
                            optionLabel="nome"
                            placeholder={formData.cidade || "Selecione uma Cidade"}
                        />
                    </div>
                    <div className={`${styles.inputArea} ${styles.inputAreaBairro}`}>
                        <label>Bairro</label>
                        <Dropdown
                            value={selectedHood}
                            options={hoods}
                            onChange={(e) => setSelectedHood(e.value)}
                            optionLabel="nome"
                            placeholder={formData.bairro || "Selecione um Bairro"}
                        />
                    </div>
                    <div className={`${styles.inputArea} ${styles.inputAreaCEP}`}>
                        <label>CEP</label>
                        <InputText
                            className={styles.input}
                            name="cep"
                            value={formData.cep || ""}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className={styles.inputRow}>
                    <div className={`${styles.inputArea} ${styles.inputAreaEndereço}`}>
                        <label>Endereço</label>
                        <InputText
                            className={styles.input}
                            name="endereco"
                            value={formData.endereco || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={`${styles.inputArea} ${styles.inputAreaNumero}`}>
                        <label>Número</label>
                        <InputText
                            className={styles.input}
                            name="numero"
                            value={formData.numero || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={`${styles.inputArea} ${styles.inputAreaComplemento}`}>
                        <label>Complemento</label>
                        <InputText
                            className={styles.input}
                            name="complemento"
                            value={formData.complemento || ""}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className={styles.inputRow}>
                    <div className={`${styles.inputArea} ${styles.inputAreaEmail}`}>
                        <label>Email</label>
                        <InputText
                            className={`${styles.input} ${styles.inputEmail}`}
                            name="email"
                            value={formData.email || ""}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className={styles.buttonContainer}>
                    <Link to="/people" className={styles.buttonContainer}>
                        <Button className={`${styles.button} ${styles.cancelButton}`} label="CANCELAR" type="button" />
                    </Link>
                    <Button className={`${styles.button} ${styles.saveButton}`} label="SALVAR" type="submit" />
                </div>
            </form>
            <ToastContainer autoClose={3000} position="bottom-left" />
        </Card>
    );
};

export default PeopleForm;
