import React from "react";
import Footer from "../../footer/Footer";
import styles from './MenuLayout.module.css'; 
import MenuHeader from "../../header/headerMenu/MenuHeader";

const MenuLayout = ({ children }) => {
    return (
        <div >
            <MenuHeader />
            <div className={styles.layout}>
            <main className={styles.mainContent}>
                {children}
            </main>
            <Footer />
            </div>
            
        </div>
    );
}

export default MenuLayout;
