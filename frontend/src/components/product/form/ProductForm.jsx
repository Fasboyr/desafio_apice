import React, { useEffect, useRef, useState } from "react";
import styles from "./ProductForm.module.css";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from "axios";
import { toast } from "react-toastify";

const ProductForm = ({ getProducts, onEdit, setOnEdit }) => {
    const ref = useRef();
    const [valorVenda, setValorVenda] = useState("");

    useEffect(() => {
        if (onEdit) {
            const product = ref.current;

            product.id.value = onEdit.id;
            product.nome.value = onEdit.nome;
            setValorVenda(formatToCurrency(onEdit.vr_venda)); // Usar a função aqui
        }
    }, [onEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const product = ref.current;

        if (
            !product.id.value ||
            !product.nome.value ||
            !valorVenda
        ) {
            return toast.warn("Preencha todos os campos!");
        }

        // Remover caracteres não numéricos e converter para float
        const valorNumerico = parseFloat(valorVenda.replace(/[^\d,]/g, '').replace(',', '.'));

        if (isNaN(valorNumerico)) {
            return toast.warn("Valor de venda inválido!");
        }

        if (onEdit) {
            await axios
                .put("http://localhost:8800/products/" + onEdit.id, {
                    id: product.id.value,
                    nome: product.nome.value,
                    vr_venda: valorNumerico,
                })
                .then(({ data }) => toast.success(data))
                .catch(({ data }) => toast.error(data));
        } else {
            await axios
                .post("http://localhost:8800/products", {
                    id: product.id.value,
                    nome: product.nome.value,
                    vr_venda: valorNumerico
                })
                .then(({ data }) => toast.success(data))
                .catch(({ data }) => toast.error(data));
        }

        product.id.value = "";
        product.nome.value = "";
        setValorVenda(""); 

        setOnEdit(null);
        getProducts();
    };

    const formatToCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const handleValorChange = (e) => {
        setValorVenda(e.target.value); 
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
                <InputText 
                    className={styles.inputValor} 
                    name="vr_venda" 
                    value={valorVenda} 
                    onChange={handleValorChange} 
                />
            </div>
            <Button className={styles.button} label="SALVAR" type="submit" />
        </form>
    );
};

export default ProductForm;
