import React, { useEffect, useRef } from "react";
import styles from "./ProductForm.module.css";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from "axios"
import { toast } from "react-toastify";


const ProductForm = ({getProducts, onEdit, setOnEdit }) => {
    const ref = useRef();

    useEffect(() => {
        if (onEdit) {
            const product = ref.current;

            product.id.value = onEdit.id;
            product.nome.value = onEdit.nome;
            product.vr_venda.value = onEdit.vr_venda;
        }
    }, [onEdit]);



    const handleSubmit = async (e) => {
        e.preventDefault();

        const product = ref.current;

        if (
            !product.id.value ||
            !product.nome.value ||
            !product.vr_venda.value
        ) {
            return toast.warn("Preencha todos os campos!");
        }

        if (onEdit) {
            await axios
                .put("http://localhost:8800/products/" + onEdit.id, {
                    id: product.id.value,
                    nome: product.nome.value,
                    vr_venda: product.vr_venda.value,
                })
                .then(({ data }) => toast.success(data))
                .catch(({ data }) => toast.error(data));
        } else {
            await axios
                .post("http://localhost:8800/products", {
                    id: product.id.value,
                    nome: product.nome.value,
                    vr_venda: product.vr_venda.value
                })
                .then(({ data }) => toast.success(data))
                .catch(({ data }) => toast.error(data));
        }


        product.id.value = "";
        product.nome.value = "";
        product.vr_venda.value = "";

        setOnEdit(null);
        getProducts();
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
                <label>Valor de Venda</label>
                <InputText className={styles.inputUf} name="vr_venda" />
            </div>
            <Button className={styles.button} label="SALVAR" type="submit" />
        </form>
    );
};

export default ProductForm;