import React from "react";
import Navbar from "./components/navbar/Navbar.jsx"; 
import Footer from "./components/footer/Footer.jsx";
import DarkVeil from "./components/Darkveil/Darkveil.jsx";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout-wrapper">

      {/* Fondo animado */}
      <div className="darkveil-background">
        <DarkVeil
          hueShift={237}
          noiseIntensity={0.09}
          scanlineIntensity={0}
          speed={3}
          scanlineFrequency={3}
          warpAmount={3}
        />
      </div>

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
