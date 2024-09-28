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
import jsPDF from 'jspdf';
import { addLocale } from 'primereact/api';
import SalesForm from "../form/SaleForm";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { MdAddShoppingCart } from "react-icons/md";
import { RiPrinterFill } from "react-icons/ri";

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
        await getProducts();
        await getItems();
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

        return filteredSales.sort((a, b) => (a.id > b.id ? 1 : -1));
    };

    const handleEdit = (item) => {
        setSelectedSale(item);
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

    const getPerson = async (id) => {
        try {
            const res = await axios.get("http://localhost:8800/people");
            const filteredPerson = res.data.find(person => person.id === id);

            if (!filteredPerson) return null;
            return filteredPerson;

        } catch (error) {
            toast.error(error.message);
            return null; 
        }
    };

    const generatePDF = async (sale) => {
        const selectedPerson = await getPerson(sale.id_pessoa);
        const doc = new jsPDF();
        doc.setProperties({
            title: `Relatório de Venda - Código: ${sale.id} | Cliente: ${selectedPerson.nome || "Não informado"}`
        });
        
        doc.setFontSize(24);
        doc.text('Relatório de Venda', doc.internal.pageSize.getWidth() / 2, 10, { align: 'center' });
    
        doc.setFontSize(14);
        const pageWidth = doc.internal.pageSize.getWidth();
        const rightMargin = 10;
        const leftPosition = 10;
    
        const saleInfoYPosition = 20;
    
        doc.text(`Código: ${sale.id}`, leftPosition, saleInfoYPosition);
        doc.text(`Data de Venda: ${sale.data_venda}`, pageWidth - doc.getTextWidth(`Data de Venda: ${sale.data_venda}`) - rightMargin, saleInfoYPosition);

        doc.setLineWidth(0.8);
        doc.line(10, saleInfoYPosition + 5, pageWidth - 10, saleInfoYPosition + 5);
    
        doc.setFontSize(18);
        const customerTitleYPosition = saleInfoYPosition + 20;
        doc.text(`Cliente`, pageWidth / 2, customerTitleYPosition, { align: 'center' });
    
        if (selectedPerson) {
            doc.setFontSize(14);
            const customerYPosition = saleInfoYPosition + 32;
    
            doc.text(`Nome: ${selectedPerson.nome || "Não informado"}`, 10, customerYPosition);
            doc.text(`Endereço: ${selectedPerson.endereco || "Não informado"}, ${selectedPerson.numero || ""} ${selectedPerson.complemento ? `- ${selectedPerson.complemento}` : ""}`, 10, customerYPosition + 10);
            doc.text(`Bairro: ${selectedPerson.bairro || "Não informado"}`, 10, customerYPosition + 20);
            doc.text(`Cidade: ${selectedPerson.cidade || "Não informado"}`, 10, customerYPosition + 30);
            doc.text(`CEP: ${selectedPerson.cep || "Não informado"}`, 10, customerYPosition + 40);
            doc.text(`Telefone: ${selectedPerson.telefone || "Não informado"}`, 10, customerYPosition + 50);
            doc.text(`E-mail: ${selectedPerson.email || "Não informado"}`, 10, customerYPosition + 60);
        } else {
            doc.text(`Cliente não encontrado.`, 10, saleInfoYPosition + 25);
        }
    
        const productsYPosition = selectedPerson ? saleInfoYPosition + 110 : 75;

        doc.setFontSize(18);
        const productsTitleYPosition = productsYPosition - 2;
        doc.text(`Produtos`, pageWidth / 2, productsTitleYPosition, { align: 'center' });

        doc.setFontSize(14);
        const headerYPosition = productsYPosition + 10;
        doc.text(`Nome`, 12, headerYPosition);
        doc.text(`Quantidade`, 75, headerYPosition);
        doc.text(`Preço Unitário`, 115, headerYPosition);
        doc.text(`Subtotal`, 165, headerYPosition);
        doc.setLineWidth(0.5);
        doc.line(70, headerYPosition - 5, 70, headerYPosition + 5); 
        doc.line(110, headerYPosition - 5, 110, headerYPosition + 5); 
        doc.line(160, headerYPosition - 5, 160, headerYPosition + 5);
    
        doc.setLineWidth(0.5);
        doc.line(10, headerYPosition + 5, pageWidth - 10, headerYPosition + 5);
    
    
        let yPosition = headerYPosition + 10; 


        const saleItems = items.filter(item => item.id_venda === sale.id);

        if (saleItems.length > 0) {
            saleItems.forEach((item) => {
                const product = products.find(p => p.id === item.id_produto);
                const productName = product ? product.nome : "Produto desconhecido";
                doc.setLineWidth(0.5);
                doc.line(70, yPosition - 5, 70, yPosition + 3); 
                doc.line(110, yPosition - 5, 110, yPosition + 3); 
                doc.line(160, yPosition - 5, 160, yPosition + 3);

                doc.setFontSize(10);
                doc.text(productName, 12, yPosition);
                doc.text(`${item.qtde}`, 75, yPosition);
                doc.text(`${formatToCurrency(item.preco_unitario)}`, 115, yPosition);
                doc.text(`${formatToCurrency(item.qtde * item.preco_unitario)}`, 165, yPosition);
    
                doc.setLineWidth(0.5);
                doc.line(10, yPosition - 5, pageWidth - 10, yPosition - 5);
    
                yPosition += 8; 
            });
        } else {
            doc.setFontSize(12);
            doc.text(`Nenhum item registrado para essa venda.`, 10, yPosition);
        }
    
        const footerYPosition = yPosition + 40;
        const signatureLineX = pageWidth - 80 - rightMargin;
        doc.setFontSize(14);
        doc.text(`Total da Venda:`, 10, footerYPosition);
        doc.text(`${formatToCurrency(sale.total_venda)}`, 10, footerYPosition + 10);


        doc.setFontSize(12);
        doc.text('_________________________________', signatureLineX, footerYPosition);
    
        const signatureText = 'Assinatura do Cliente';
        const textWidth = doc.getTextWidth(signatureText);
        const centeredSignatureX = signatureLineX + (doc.getTextWidth('_________________________________') - textWidth) / 2;
        doc.text(signatureText, centeredSignatureX, footerYPosition + 10);
    
        const blobUrl = doc.output('bloburl');
        window.open(blobUrl);
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

                <Button icon={<span className={style.iconSpacing}><MdAddShoppingCart /></span>} className={style.addButton} onClick={handleAddClick}>Adicionar</Button>
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
                                            <RiPrinterFill className={style.icon} onClick={() => generatePDF(item)} />
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
