import React, { useEffect, useState } from "react";
import styles from "./PeopleForm.module.css";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Card } from "primereact/card";

const PeopleForm = ({ onClose, person }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hoods, setHoods] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedHood, setSelectedHood] = useState(null);
    const [formData, setFormData] = useState({
        id: person ? person.id : '',
        nome: person ? person.nome : '',
        id_cidade: person ? person.id_cidade : '',
        id_bairro: person ? person.id_bairro : '',
        cidade: person ? person.cidade : '',
        bairro: person ? person.bairro : '',
        cep: person ? person.cep : '',
        endereco: person ? person.endereco : '',
        numero: person ? person.numero : '',
        complemento: person ? person.complemento : '',
        telefone: person ? person.telefone : '',
        email: person ? person.email : ''
    });

    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        getHoods();
        getCities();
    }, []);

    useEffect(() => {
        if (person) {
            setFormData({
                id: person.id,
                nome: person.nome,
                id_cidade: person.id_cidade,
                id_bairro: person.id_bairro,
                cidade: person.cidade,
                bairro: person.bairro,
                cep: person.cep,
                endereco: person.endereco,
                numero: person.numero,
                complemento: person.complemento,
                telefone: person.telefone,
                email: person.email
            });


            const selectedCity = cities.find(city => city.id === person.id_cidade) || null;
            const selectedHood = hoods.find(hood => hood.id === person.id_bairro) || null;
            setSelectedCity(selectedCity);
            setSelectedHood(selectedHood);
            setIsEdit(true);
        } else {
            setIsEdit(false);
            setFormData({
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
            setSelectedCity(null);
            setSelectedHood(null);
        }
    }, [person, cities, hoods]);

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
            onClose();
        } catch (error) {
            toast.error("Ocorreu um erro ao salvar os dados.");
        }
    };
    const formatPhone = (phone, isFocused) => {
        const cleaned = ('' + phone).replace(/\D/g, '');

        let formattedPhone = phone;

        if (cleaned.length <= 2) {
            formattedPhone = isFocused || cleaned.length > 0 ? `(${cleaned}` : cleaned;
        } else if (cleaned.length <= 6) {
            formattedPhone = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
        } else if (cleaned.length === 10) {
            formattedPhone = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`;
        } else if (cleaned.length === 11) {
            formattedPhone = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 3)} ${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
        }

        return formattedPhone;
    };

    const handleFocus = () => setIsFocused(true);

    const handleBlur = () => {
        if ((formData.telefone).length === 0) setIsFocused(false);
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
                            value={formatPhone(formData.telefone, isFocused) || ""}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
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
                    <Button onClick={onClose} className={`${styles.button} ${styles.cancelButton}`} label="CANCELAR" type="button" />
                    <Button className={`${styles.button} ${styles.saveButton}`} label="SALVAR" type="submit" />
                </div>
            </form>
            <ToastContainer autoClose={3000} position="top-right" />
        </Card>
    );

};

export default PeopleForm;
