import React, { useEffect, useState } from "react";
import style from "./SaleList.module.css";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Card } from 'primereact/card';
import { useLocation } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from 'primereact/calendar';
import { InputText } from "primereact/inputtext";

import { addLocale } from 'primereact/api';
import SalesForm from "../form/SaleForm";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { MdAddShoppingCart } from "react-icons/md";

addLocale('pt-BR', {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar',
    weekHeader: 'Semana',
    dateFormat: 'dd/mm/yy',
    strong: 'Forte',
});


const SalesList = () => {
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const location = useLocation();

    const filterOptions = [
        { label: 'Período de Venda', value: 'date' },
        { label: 'Pessoa', value: 'person' },
        { label: 'Produto', value: 'product' }
    ];


    const handleAddClick = () => {
        setSelectedSale(null);
        setShowModal(true);
    };

    const handleCloseModal = async () => {
        setShowModal(false);
        setSelectedSale(null);
        await getSales();
    };


    const getSales = async () => {
        try {
            const res = await axios.get("http://localhost:8800/sales");
            setSales(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getProducts = async () => {
        try {
            const res = await axios.get("http://localhost:8800/products");
            setProducts(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getItems = async () => {
        try {
            const res = await axios.get("http://localhost:8800/saleItens/");
            setItems(res.data);
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {

        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get("modal") === "true") {
            handleAddClick();
        }

        getSales();
        getProducts();
        getItems();
    }, [location.search]);

    const filterAndSortSales = () => {
        let filteredSales = [...sales];

        if (selectedFilter === 'person' && selectedPerson) {
            filteredSales = filteredSales.filter(sale => sale.pessoa === selectedPerson);
        }

        if (selectedFilter === 'product' && selectedProduct) {
            const salesWithSelectedProduct = items
                .filter(item => item.id_produto === selectedProduct)
                .map(item => item.id_venda);
            filteredSales = filteredSales.filter(sale => salesWithSelectedProduct.includes(sale.id));
        }

        if (selectedFilter === 'date' && startDate && endDate) {
            filteredSales = filteredSales.filter(sale => {
                const [day, month, year] = sale.data_venda.split('/');
                const saleDate = new Date(year, month - 1, day);

                const start = new Date(startDate);
                const end = new Date(endDate);

                return saleDate >= start && saleDate <= end;
            });
        }

        return filteredSales.sort((a, b) => (a.pessoa > b.pessoa ? 1 : -1));
    };

    const handleEdit = (item) => {
        setSelectedSale(item);
        console.log(item);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            const { data } = await axios.delete("http://localhost:8800/sales/" + id);
            setSales(sales.filter((sale) => sale.id !== id));
            toast.success(data);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const uniquePeople = Array.from(new Set(sales.map(sale => sale.pessoa)))
        .map(pessoa => ({ label: pessoa, value: pessoa }));

    const formatToCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const totalSales = filterAndSortSales().reduce((total, sale) => total + sale.total_venda, 0);

    return (
        <Card className={style.card}>
            <div className={style.cardHeader}>
                <div className={style.cardTitle}>Vendas</div>
            </div>
            <div className={style.buttonContainer}>
                <div className={`${style.filterDropdown} ${selectedFilter === 'person' || selectedFilter === 'product' ? style.activeFilters : style.noFilterOrDateActive}`}>
                    <Dropdown
                        value={selectedFilter}
                        options={filterOptions}
                        onChange={(e) => {
                            setSelectedFilter(e.value);
                            setSelectedPerson(null);
                            setSelectedProduct(null);
                        }}
                        placeholder="Filtrar a lista por:"
                    />
                </div>

                {selectedFilter === 'person' && (
                    <div className={style.personDropdown}>
                        <Dropdown
                            value={selectedPerson}
                            options={uniquePeople}
                            onChange={(e) => setSelectedPerson(e.value)}
                            placeholder="Selecione uma pessoa"
                        />
                    </div>
                )}

                {selectedFilter === 'product' && (
                    <div className={style.productDropdown}>
                        <Dropdown
                            className={style.fixedDropdown}
                            value={selectedProduct}
                            options={products.map(product => ({ label: product.nome, value: product.id }))}
                            onChange={(e) => setSelectedProduct(e.value)}
                            placeholder="Selecione um produto"
                        />
                    </div>
                )}

                {selectedFilter === 'date' && (
                    <div className={style.dateContainer}>
                        <Calendar
                            value={startDate}
                            onChange={(e) => setStartDate(e.value)}
                            placeholder="Data Inicial"
                            locale="pt-BR"
                            dateFormat="dd/mm/yy"
                        />
                        <span className={style.dateSeparator}>à</span>
                        <Calendar
                            value={endDate}
                            onChange={(e) => setEndDate(e.value)}
                            placeholder="Data Final"
                            locale="pt-BR"
                            dateFormat="dd/mm/yy"
                        />
                    </div>
                )}

                <Button  icon={<span className={style.iconSpacing}><MdAddShoppingCart /></span>} className={style.addButton} onClick={handleAddClick}>Adicionar</Button>
            </div>
            <div className={style.outerContainer}>
                <div className={style.innerContainer}>
                    <div className={style.tableWrapper}>
                        <table className={style.table}>
                            <thead>
                                <tr>
                                    <th className={style.th}>Código</th>
                                    <th className={style.th}>Cliente</th>
                                    <th className={style.th}>Total de Venda</th>
                                 
                                </tr>
                            </thead>
                            <tbody className={style.tbody}>
                                {filterAndSortSales().map((item, i) => (
                                    <tr key={i} className={style.tr}>
                                        <td className={`${style.td} ${style.tdId}`}>{item.id}</td>
                                        <td className={`${style.td} ${style.tdNome}`}>{item.pessoa}</td>
                                        <td className={`${style.td} ${style.tdTotal}`}>{formatToCurrency(item.total_venda)}</td>
                                        <td className={`${style.td} ${style.tdIcon}`}>
                                            <FaEdit className={style.icon} onClick={() => handleEdit(item)} />
                                            <FaTrash className={style.icon} onClick={() => handleDelete(item.id)} />
                                        </td>



                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>
                <div className={style.totalContainer}>
                    <div className={style.inputAreaTotal}>
                        <label htmlFor="valorTotal" className={style.label}>Total Final:</label>
                        <InputText
                            id="valorTotal"
                            className={`${style.input} ${style.inputTotal}`}
                            name="total_venda"
                            value={formatToCurrency(totalSales)}
                            readOnly
                        />
                    </div>
                </div>
            </div>
            <Dialog header="Adicionar Venda" visible={showModal} onHide={handleCloseModal}>
                <SalesForm onClose={handleCloseModal} sale={selectedSale} />
            </Dialog>
            <ToastContainer autoClose={3000} position="top-right" />
        </Card>
    );
};

export default SalesList;
