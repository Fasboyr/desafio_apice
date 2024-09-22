import React, { useEffect, useState } from "react";
import styles from "./SaleForm.module.css";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Card } from "primereact/card";
import { FaEdit, FaShoppingCart, FaTrash } from "react-icons/fa";

const SalesForm = ({ onClose, sale }) => {
    const [people, setPeople] = useState([]);
    const [product, setProduct] = useState([]);
    const [item, setItem] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        id: sale ? sale.id : '',
        total_venda: sale ? sale.total_venda : '',
        id_pessoa: sale ? sale.id_pessoa : '',
        data_venda: sale ? sale.data_venda : '',
        nome: sale ? sale.pessoa : '',
        qtde: '',
        vr_item: '',
        vr_venda: ''
    });

    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        getPeople();
        getProduct();
        getItem();
    }, []);

    useEffect(() => {
        if (sale) { 
            setFormData({
                id: sale.id,
                total_venda: sale.total_venda,
                id_pessoa: sale.id_pessoa,
                data_venda: sale.data_venda,
                nome: sale.nome,
                qtde: '',
                vr_item: ''
            });
    
            const selectedPerson = people.find(person => person.id === sale.id_pessoa) || null;
            setSelectedPerson(selectedPerson);
            setIsEdit(true);
        } else {
            setIsEdit(false);
            setFormData({ 
                id: '',
                total_venda: '',
                id_pessoa: '',
                data_venda: '',
                nome: '',
                qtde: '',
                vr_item: ''
            });
            setSelectedPerson(null);
        }
    }, [sale, people]);

    useEffect(() => {
        const quantity = parseFloat(formData.qtde) || 0;
        const unitPrice = parseFloat(formData.vr_venda) || (selectedProduct ? parseFloat(selectedProduct.vr_venda) : 0);
        const subtotal = quantity * unitPrice;

        setFormData(prev => ({
            ...prev,
            vr_item: subtotal.toFixed(2)
        }));
    }, [formData.qtde, formData.vr_venda, selectedProduct]);

    formData.total_venda = item
        .filter(i => i.id_venda === formData.id)
        .reduce((acc, curr) => acc + parseFloat(curr.vr_item || 0), 0)
        .toFixed(2);


    const getPeople = async () => {
        try {
            const res = await axios.get("http://localhost:8800/people");
            setPeople(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getProduct = async () => {
        try {
            const res = await axios.get("http://localhost:8800/products");
            setProduct(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getItem = async () => {
        try {
            const res = await axios.get("http://localhost:8800/saleItens/");
            const updatedItems = res.data.map(item => ({
                ...item,
                wasEdited: false,
                isNew: false
            }));
            updatedItems.sort((a, b) => a.id_produto - b.id_produto);
            setItem(updatedItems);
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

    const handleProductChange = (e) => {
        const selected = e.value;
        setSelectedProduct(selected);
        setFormData(prev => ({
            ...prev,
            vr_venda: prev.vr_venda || selected.vr_venda
        }));
    };

    const handleEditItem = (itemToEdit) => {
        setSelectedProduct(product.find(p => p.id === itemToEdit.id_produto));
        setFormData(prev => ({
            ...prev,
            id: itemToEdit.id_venda,
            qtde: itemToEdit.qtde,
            vr_venda: itemToEdit.preco_unitario,
            vr_item: itemToEdit.vr_item
        }));

    };

    const handleAddItemToCart = () => {
        if (!formData.qtde || !selectedProduct) {
            return toast.warn("Selecione um produto e a quantidade!");
        }
        const existingItemIndex = item.findIndex(i => i.id_produto === selectedProduct.id && i.id_venda === formData.id);

        if (existingItemIndex >= 0) {
            const updatedItem = {
                ...item[existingItemIndex],
                qtde: formData.qtde,
                preco_unitario: formData.vr_venda,
                vr_item: formData.vr_item,
                wasEdited: true,
            };


            const newItems = [...item];
            newItems[existingItemIndex] = updatedItem;
            setItem(newItems);


            toast.success("Item editado no carrinho.");
        } else {
            const newItem = {
                id_venda: formData.id,
                id_produto: selectedProduct.id,
                produto: selectedProduct.nome,
                qtde: formData.qtde,
                preco_unitario: formData.vr_venda,
                vr_item: formData.vr_item,
                wasEdited: false,
                isNew: true
            };
            setItem(prevItems => [...prevItems, newItem]);

            toast.success("Item adicionado ao carrinho.");
        }

        setFormData(prev => ({
            ...prev,
            qtde: '',
            vr_item: '',
            vr_venda: ''
        }));
        setSelectedProduct(null);
    };

    const handleSaveItens = async () => {
        for (const items of item) {
            if (items.isNew) {
                await axios.post("http://localhost:8800/saleItens", {
                    ...items,
                });
            } else if (items.wasEdited) {
                await axios.put(`http://localhost:8800/saleItens/${items.id_venda}/${items.id_produto}`, {
                    ...items,
                });
            }
            
            await axios.put(`http://localhost:8800/products/${items.id_produto}`, {
                id: items.id_produto,
                nome: items.produto,
                vr_venda: items.preco_unitario 
            });
            
        }
        toast.success("Itens salvos com sucesso.");
    };




    const handleDelete = async (itemToDelete) => {
        try {
            const { data } = await axios.delete(`http://localhost:8800/saleItens/${itemToDelete.id_venda}/${itemToDelete.id_produto}`);
            setItem(item.filter((item) => item.id_venda !== itemToDelete.id_venda || item.id_produto !== itemToDelete.id_produto));
            toast.success(data);
        } catch (error) {
            toast.error(error.message);
        }
    };
    const isValidItem = (item, currentIdVenda) => {
        return item.id_venda === currentIdVenda &&
            item.id_produto &&
            item.produto &&
            item.qtde &&
            item.vr_item;
    };

    const hasValidItems = (currentIdVenda) => {
        return item.some((i) => isValidItem(i, currentIdVenda));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !formData.id ||
            !(selectedPerson || formData.id_pessoa) ||
            !formData.total_venda ||
            !formData.data_venda
        ) {
            return toast.warn("Preencha todos os campos!");
        } else if (!hasValidItems(formData.id)) {
            return toast.warn("Preencha ao menos um item!");
        }

        try {
            const personId = selectedPerson.id;
            if (isEdit) {
                await axios.put("http://localhost:8800/sales/" + formData.id, {
                    id: formData.id,
                    id_pessoa: personId,
                    total_venda: formData.total_venda,
                    data_venda: formData.data_venda
                });
                toast.success("Venda atualizada com sucesso.");
            } else {
                await axios.post("http://localhost:8800/sales", {
                    id: formData.id,
                    id_pessoa: personId,
                    total_venda: formData.total_venda,
                    data_venda: formData.data_venda
                });
                toast.success("Venda adicionada com sucesso.");
            }

            await handleSaveItens();

            setFormData({
                id: '',
                total_venda: '',
                id_pessoa: '',
                data_venda: '',
                nome: '',
                qtde: '',
                vr_item: ''
            });
            setSelectedPerson(null);
            onClose();
        } catch (error) {
            toast.error("Ocorreu um erro ao salvar os dados.");
            console.log(error);
        }
    };


    return (
        <Card className={styles.card} title={<div className={styles.cardTitle}>Cadastro de Vendas</div>}>
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
                    <div className={`${styles.inputArea} ${styles.inputAreaData}`}>
                        <label>Data de Venda</label>
                        <InputText
                            className={`${styles.input} ${styles.inputData}`}
                            name="data_venda"
                            value={formData.data_venda || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={`${styles.inputArea} ${styles.inputAreaPessoa}`}>
                        <label>Pessoa</label>
                        <Dropdown
                            className={` ${styles.inputPessoa}`}
                            value={selectedPerson}
                            options={people}
                            onChange={(e) => setSelectedPerson(e.value)}
                            optionLabel="nome"
                            placeholder={formData.nome || "Selecione uma Pessoa"}
                        />
                    </div>
                </div>
                <div className={styles.inputRow}>
                    <div className={`${styles.inputArea} ${styles.inputAreaCidade}`}>
                        <label>Produto</label>
                        <Dropdown
                            value={selectedProduct}
                            options={product}
                            onChange={handleProductChange}
                            optionLabel="nome"
                            placeholder={"Selecione um Produto"}
                        />

                    </div>
                    <div className={`${styles.inputArea} ${styles.inputAreaCEP}`}>
                        <label>Nº de Itens</label>
                        <InputText
                            className={styles.input}
                            name="qtde"
                            value={formData.qtde || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={`${styles.inputArea} ${styles.inputAreaCEP}`}>
                        <label>Valor Unitário</label>
                        <InputText
                            className={styles.input}
                            name="vr_venda"
                            value={formData.vr_venda || ""}
                            onChange={handleChange}
                            keyfilter="money"
                        />

                    </div>
                    <div className={`${styles.inputArea} ${styles.inputAreaCEP}`}>
                        <label>Sub. Total</label>
                        <InputText
                            className={styles.input}
                            name="vr_item"
                            value={'R$ ' + formData.vr_item || ""}
                            readOnly
                            keyfilter="money"
                        />
                    </div>
                    <div className={` ${styles.buttonShop}`}>
                        <Button className={styles.shopButton} icon={<FaShoppingCart />} onClick={handleAddItemToCart} type="button" />
                    </div>
                </div>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Código</th>
                            <th className={styles.th}>Produto</th>
                            <th className={styles.th}>Nº de Itens</th>
                            <th className={styles.th}>Valor Unitário</th>
                            <th className={styles.th}>Sub. Total</th>
                            <th className={styles.th}></th>
                            <th className={styles.th}></th>
                        </tr>
                    </thead>
                    <tbody className={styles.tbody}>
                        {item
                            .filter(i => i.id_venda === formData.id)
                            .map((item, i) => (
                                <tr key={i} className={styles.tr}>
                                    <td className={`${styles.td} ${styles.width15}`}>{item.id_produto}</td>
                                    <td className={`${styles.td} ${styles.width30}`}>{item.produto}</td>
                                    <td className={`${styles.td} ${styles.width30}`}>{item.qtde}</td>
                                    <td className={`${styles.td} ${styles.width30}`}>R$ {item.preco_unitario}</td>
                                    <td className={`${styles.td} ${styles.width30}`}>R$ {item.vr_item}</td>
                                    <td className={`${styles.td} ${styles.width5} ${styles.alignCenter}`}>
                                        <FaEdit onClick={() => handleEditItem(item)} />
                                    </td>
                                    <td className={`${styles.td} ${styles.width5} ${styles.alignCenter}`}>
                                        <FaTrash onClick={() => handleDelete(item)} />
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                <div className={styles.buttonContainer}>
                    <div className={`${styles.inputArea} ${styles.inputAreaTotal}`}>
                        <label>Valor Total da Compra:</label>
                        <InputText
                            className={`${styles.input} ${styles.inputTotal}`}
                            name="total_venda"
                            value={'R$ ' + formData.total_venda}
                            readOnly

                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <Button  onClick={onClose} className={`${styles.button} ${styles.cancelButton}` } label="CANCELAR" type="button" />
                        <Button className={`${styles.button} ${styles.saveButton}`} label="SALVAR" type="submit" />
                    </div>
                </div>


            </form>

            <ToastContainer autoClose={3000} position="bottom-left" />
        </Card>
    );
};

export default SalesForm;
