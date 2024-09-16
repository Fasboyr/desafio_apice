import React from "react";
import Header from "./header/Header";
import Footer from "./footer/Footer";



const DefaultLayout = ({ children }) => {

    return (
        <div className="background">
            <Header />
            {children}
            <Footer />
        </div>
    );
}

export default DefaultLayout;