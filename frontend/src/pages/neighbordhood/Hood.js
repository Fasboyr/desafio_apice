import React, { useEffect, useRef } from "react";
import styles from "./Hood.module.css";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from "axios"
import { toast } from "react-toastify";


const Form = ({getHoods, onEdit, setOnEdit }) => {
    const ref = useRef();

    useEffect(() => {
        if (onEdit) {
            const neighbordhood = ref.current;

            neighbordhood.id.value = onEdit.id;
            neighbordhood.nome.value = onEdit.nome;
        }
    }, [onEdit]);



    const handleSubmit = async (e) => {
        e.preventDefault();

        const neighbordhood = ref.current;

        if (
            !neighbordhood.id.value ||
            !neighbordhood.nome.value
        ) {
            return toast.warn("Preencha todos os campos!");
        }

        if (onEdit) {
            await axios
                .put(`http://localhost:8800/${onEdit.id}`, {
                    id: neighbordhood.id.value,
                    nome: neighbordhood.nome.value,
                })
                .then(({ data }) => toast.success(data))
                .catch(({ data }) => toast.error(data));
        } else {
            await axios
                .post("http://localhost:8800", {
                    id: neighbordhood.id.value,
                    nome: neighbordhood.nome.value,
                })
                .then(({ data }) => toast.success(data))
                .catch(({ data }) => toast.error(data));
        }


        neighbordhood.id.value = "";
        neighbordhood.nome.value = "";

        setOnEdit(null);
        getHoods();
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
            <Button className={styles.button} label="SALVAR" type="submit" />
        </form>
    );
};

export default Form;