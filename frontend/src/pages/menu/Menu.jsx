import React from 'react';
import { Button } from 'primereact/button';
import { FaCity, FaBuilding, FaProductHunt, FaList, FaPlus, FaBox, FaMapMarkerAlt, FaClipboardList } from 'react-icons/fa';
import { MdAddShoppingCart } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import { Link } from 'react-router-dom';
import style from './Menu.module.css';  
import { Card } from 'primereact/card';

const Menu = () => {
    return (
        <Card title={<h2 className={style.menuTitleCard}>Menu de Navegação</h2>} className={style.cardContent}>
            <div className={style.row}>
                <div className={`${style.menuSectionGroup} ${style.borderedGroup}`}>
                    <h3 className={style.menuTitle}>Pessoas</h3>
                    <div className={style.menuButtonGroup}>
                        <Link to="/people?modal=true">
                            <Button label="Cadastro" icon={<span className={style.iconSpacing}><IoMdPersonAdd /></span>} className="p-button-success p-button-lg" />
                        </Link>
                        <Link to="/people">
                            <Button label="Listagem" icon={<span className={style.iconSpacing}><FaClipboardList /></span>} className="p-button-info p-button-lg" />
                        </Link>
                    </div>

                    <div className={style.separator} />

                    <div className={style.peopleRow}>
                        <Link to="/cities">
                            <Button label="Cidades" icon={<span className={style.iconSpacing}><FaCity /></span>} className={`${style.cityButton} ${style.customButton} p-button-lg`} />
                        </Link>
                        <div className={style.spacer} />
                        <Link to="/hood">
                            <Button label="Bairros" icon={<span className={style.iconSpacing}><FaMapMarkerAlt /></span>} className={`${style.customButton} p-button-lg`} />
                        </Link>
                    </div>
                </div>

                <div className={`${style.menuSectionGroup} ${style.borderedGroup}`}>
                    <h3 className={style.menuTitle}>Vendas</h3>
                    <div className={style.menuButtonGroup}>
                        <Link to="/sales?modal=true">
                            <Button label="Cadastro" icon={<span className={style.iconSpacing}><MdAddShoppingCart /></span>} className="p-button-success p-button-lg" />
                        </Link>
                        <Link to="/sales">
                            <Button label="Listagem" icon={<span className={style.iconSpacing}><FaClipboardList /></span>} className="p-button-info p-button-lg" />
                        </Link>
                    </div>

                    <div className={style.separator} />

                    <div className={style.saleRow}>
                        <Link to="/products">
                            <Button label="Produtos" icon={<span className={style.iconSpacing}><FaBox /></span>} className={`${style.customButton} p-button-lg`} />
                        </Link>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default Menu;
