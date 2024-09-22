import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import styles from './DefaultLayout.module.css'; 
const DefaultLayout = ({ children }) => {
    return (
        <div >
            <Header />
            <div className={styles.layout}>
            <main className={styles.mainContent}>
                {children}
            </main>
            <Footer />
            </div>
            
        </div>
    );
}

export default DefaultLayout;
