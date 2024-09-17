import React, { useEffect, useRef, useState } from "react";
import styles from "./PeopleForm.module.css";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import axios from "axios";
import { toast } from "react-toastify";
import { Card } from "primereact/card";
import { Link } from "react-router-dom";

const PeopleForm = ({ getPeople, onEdit, setOnEdit }) => {
    const ref = useRef();
    const [hoods, setHoods] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedHood, setSelectedHood] = useState(null);

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

    useEffect(() => {
        getHoods();
        getCities();
    }, []);

    useEffect(() => {
        if (onEdit) {
            const people = ref.current;

            people.id.value = onEdit.id;
            people.nome.value = onEdit.nome;
            setSelectedCity(cities.find(city => city.id === onEdit.id_cidade));
            setSelectedHood(hoods.find(hood => hood.id === onEdit.id_bairro));
            people.cep.value = onEdit.cep;
            people.endereco.value = onEdit.endereco;
            people.numero.value = onEdit.numero;
            people.complemento.value = onEdit.complemento;
            people.telefone.value = onEdit.telefone;
            people.email.value = onEdit.email;
        }
    }, [onEdit, cities, hoods]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const people = ref.current;

        if (
            !people.id.value ||
            !people.nome.value ||
            !selectedCity ||
            !selectedHood ||
            !people.cep.value ||
            !people.endereco.value ||
            !people.numero.value ||
            !people.complemento.value ||
            !people.telefone.value ||
            !people.email.value
        ) {
            return toast.warn("Preencha todos os campos!");
        }

        try {
            const cityId = selectedCity.id;
            const hoodId = selectedHood.id;

            if (onEdit) {
                await axios.put("http://localhost:8800/people/" + onEdit.id, {
                    id: people.id.value,
                    nome: people.nome.value,
                    id_cidade: cityId,
                    id_bairro: hoodId,
                    cep: people.cep.value,
                    endereco: people.endereco.value,
                    numero: people.numero.value,
                    complemento: people.complemento.value,
                    telefone: people.telefone.value,
                    email: people.email.value
                });
                toast.success("Pessoa atualizada com sucesso.");
            } else {
                await axios.post("http://localhost:8800/people", {
                    id: people.id.value,
                    nome: people.nome.value,
                    id_cidade: cityId,
                    id_bairro: hoodId,
                    cep: people.cep.value,
                    endereco: people.endereco.value,
                    numero: people.numero.value,
                    complemento: people.complemento.value,
                    telefone: people.telefone.value,
                    email: people.email.value
                });
                toast.success("Pessoa adicionada com sucesso.");
            }

            // Clear the form
            people.id.value = "";
            people.nome.value = "";
            setSelectedCity(null);
            setSelectedHood(null);
            people.cep.value = "";
            people.endereco.value = "";
            people.numero.value = "";
            people.complemento.value = "";
            people.telefone.value = "";
            people.email.value = "";

            setOnEdit(null);
            getPeople();
        } catch (error) {
            toast.error("Ocorreu um erro ao salvar os dados.");
        }
    };

    return (
        <Card className={styles.card} title={<div className={styles.cardTitle}>Cadastro de Pessoas</div>}>
            <form className={styles.formContainer} ref={ref} onSubmit={handleSubmit}>
                <div className={styles.inputRow}>
                    <div className={`${styles.inputArea} ${styles.inputAreaId}`}>
                        <label>Código</label>
                        <InputText className={`${styles.input} ${styles.inputId}`} name="id" />
                    </div>
                    <div className={`${styles.inputArea} ${styles.inputAreaNome}`}>
                        <label>Nome</label>
                        <InputText className={`${styles.input} ${styles.inputNome}`} name="nome" />
                    </div>
                    <div className={`${styles.inputArea} ${styles.inputAreaTelefone}`}>
                        <label>Telefone</label>
                        <InputText className={styles.input} name="telefone" />
                    </div>
                </div>
                <div className={styles.inputRow}>
                    <div className={`${styles.inputArea} ${styles.inputAreaCidade}`}>
                        <label>Cidade</label>
                        <Dropdown
                            value={selectedCity}
                            options={cities}
                            onChange={(e) => setSelectedCity(e.value)}
                            optionLabel="nome"  // Exibe a propriedade 'nome' dos objetos de cidade
                            placeholder="Selecione uma cidade"
                        />
                    </div>
                    <div className={`${styles.inputArea} ${styles.inputAreaBairro}`}>
                        <label>Bairro</label>
                        <Dropdown
                            value={selectedHood}
                            options={hoods}
                            onChange={(e) => setSelectedHood(e.value)}
                            optionLabel="nome"  // Exibe a propriedade 'nome' dos objetos de bairro
                            placeholder="Selecione um bairro"
                        />
                    </div>
                    <div className={`${styles.inputArea} ${styles.inputAreaCEP}`}>
                        <label>CEP</label>
                        <InputText className={styles.input} name="cep" />
                    </div>
                </div>
                <div className={styles.inputRow}>
                    <div className={`${styles.inputArea} ${styles.inputAreaEndereço}`}>
                        <label>Endereço</label>
                        <InputText className={styles.input} name="endereco" />
                    </div>
                    <div className={`${styles.inputArea} ${styles.inputAreaNumero}`}>
                        <label>Número</label>
                        <InputText className={styles.input} name="numero" />
                    </div>
                    <div className={`${styles.inputArea} ${styles.inputAreaComplemento}`}>
                        <label>Complemento</label>
                        <InputText className={styles.input} name="complemento" />
                    </div>
                </div>
                <div className={styles.inputRow}>
                    <div className={`${styles.inputArea} ${styles.inputAreaEmail}`}>
                        <label>Email</label>
                        <InputText className={`${styles.input} ${styles.inputEmail}`} name="email" />
                    </div>
                </div>

                <Link to="/people" className={styles.buttonContainer}>
                    <Button className={`${styles.button} ${styles.cancelButton}`} label="CANCELAR" type="button" />
                    <Button className={`${styles.button} ${styles.saveButton}`} label="SALVAR" type="submit" />
                </Link>
            </form>
        </Card>
    );
};

export default PeopleForm;
