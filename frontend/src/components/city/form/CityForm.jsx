import React, { useEffect, useRef } from "react";
import styles from "./CityForm.module.css";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from "axios"
import { toast } from "react-toastify";


const CityForm = ({getCities, onEdit, setOnEdit }) => {
    const ref = useRef();

    useEffect(() => {
        if (onEdit) {
            const city = ref.current;

            city.id.value = onEdit.id;
            city.nome.value = onEdit.nome;
            city.sigla_uf.value = onEdit.sigla_uf;
        }
    }, [onEdit]);



    const handleSubmit = async (e) => {
        e.preventDefault();

        const city = ref.current;

        if (
            !city.id.value ||
            !city.nome.value ||
            !city.sigla_uf.value
        ) {
            return toast.warn("Preencha todos os campos!");
        }

        if (onEdit) {
            await axios
                .put("http://localhost:8800/cities/" + onEdit.id, {
                    id: city.id.value,
                    nome: city.nome.value,
                    sigla_uf: city.sigla_uf.value,
                })
                .then(({ data }) => toast.success(data))
                .catch(({ data }) => toast.error(data));
        } else {
            await axios
                .post("http://localhost:8800/cities", {
                    id: city.id.value,
                    nome: city.nome.value,
                    sigla_uf: city.sigla_uf.value
                })
                .then(({ data }) => toast.success(data))
                .catch(({ data }) => toast.error(data));
        }


        city.id.value = "";
        city.nome.value = "";
        city.sigla_uf.value = "";

        setOnEdit(null);
        getCities();
    };

    return (
        <form className={styles.formContainer} ref={ref} onSubmit={handleSubmit}>
            <div className={styles.inputArea}>
                <label>Código</label>
                <InputText className={styles.inputCode} name="id" />
            </div>
            <div className={styles.inputArea}>
                <label>Nome</label>
                <InputText className={styles.inputName} name="nome" />
            </div>
            <div className={styles.inputArea}>
                <label>Sigla UF</label>
                <InputText className={styles.inputUf} name="sigla_uf" />
            </div>
            <Button className={styles.button} label="SALVAR" type="submit" />
        </form>
    );
};

export default CityForm;