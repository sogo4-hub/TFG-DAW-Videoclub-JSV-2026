import React from "react";
import Navbar from "./components/navbar/Navbar.jsx"; 
import Footer from "./components/footer/Footer.jsx";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout-wrapper">


      {/* NAVBAR FIJO */}
      <Navbar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="layout-content">
        {children}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
