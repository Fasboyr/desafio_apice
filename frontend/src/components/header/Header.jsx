import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "../../assets/images/logo.png";

const Header = () => {

  return (
    <div className={styles.header}>
      <img src={logo} className={styles.logo}></img>
      <nav className={styles.navLeft}>
        <ul>
          <li><Link className={styles.headerNavLink} to="/">Home</Link></li>
          <li><Link className={styles.headerNavLink} to="/change">PlaceHolder</Link></li>
        </ul>
      </nav>
      <nav className={styles.navRight}>
        <ul>
          <li><Link className={styles.headerNavLink} to="/profile"><i className="fas fa-user"></i></Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
