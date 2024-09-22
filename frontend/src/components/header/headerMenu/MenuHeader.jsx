import React from "react";
import styles from "./MenuHeader.module.css";
import banner from "../../../assets/images/banner.jpeg";

const MenuHeader = () => {
  return (
    <div className={styles.header}>
      <img src={banner} className={styles.logo} alt="Banner"></img>
    </div>
  );
};

export default MenuHeader;
