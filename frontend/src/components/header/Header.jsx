import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { FaShoppingCart, FaBox, FaUser, FaCity, FaMapMarkerAlt, FaSignInAlt } from "react-icons/fa"; // Importando ícones
import logo from "../../assets/images/logo.png";
import GlobalStyle from "../../styles/global";

const Header = () => {
  return (
    <div className={styles.header}>
      <img src={logo} className={styles.logo} alt="Logo"></img>
      <nav className={styles.navCenter}>
        <ul>
          <li className={`${styles.dropdown} ${styles.centerItems}`}>
            <Link className={styles.headerNavLink} to="/">
              <FaShoppingCart /> Vendas 
            </Link>
            <ul className={styles.dropdownContent}>
              <li><Link to="/sales" >Lista</Link></li>
              <li><Link to="/sales?modal=true">Cadastro</Link></li>
            </ul>
          </li>

          <li className={styles.centerItems}>
            <Link className={styles.headerNavLink} to="/products">
              <FaBox /> Produtos 
            </Link>
          </li>
          <li className={`${styles.dropdown} ${styles.centerItems}`}>
            <Link className={styles.headerNavLink} to="/people">
              <FaUser /> Pessoas 
            </Link>
            <ul className={styles.dropdownContent}>
              <li><Link to="/people" >Lista</Link></li>
              <li><Link to="/people?modal=true">Cadastro</Link></li>
            </ul>
          </li>
          <li className={styles.centerItems}>
            <Link className={styles.headerNavLink} to="/cities">
              <FaCity /> Cidades 
            </Link>
          </li>
          <li className={styles.centerItems}> 
            <Link className={styles.headerNavLink} to="/hood">
              <FaMapMarkerAlt /> Bairros
            </Link>
          </li>

        </ul>
      </nav>
    </div>
  );
};

export default Header;
