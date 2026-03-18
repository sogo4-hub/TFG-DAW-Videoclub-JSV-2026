// src/components/navbar/Navbar.jsx

import React from "react";
import "./Navbar.css";
import logo from "../../imgs/logo.png";

export default function Navbar() {
  return (
    <><nav className="navbar">

      {/* IZQUIERDA: LOGO + TEXTO */}
      <div className="navbar-left">
        <img src={logo} alt="StreamFlix Logo" className="navbar-logo" />
        <h3 className="navbar-title">StreamFlix</h3>
      </div>

      {/* CENTRO: ENLACES */}
      <ul className="navbar-links">
        <li><a href="/">Inicio</a></li>
        <li><a href="/catalogo">Catálogo</a></li>
        <li><a href="/series">Series</a></li>
        <li><a href="/peliculas">Películas</a></li>
      </ul>

      {/* DERECHA: BUSCADOR */}
      <div className="navbar-search">
        <input
          type="text"
          placeholder="Buscar..."
          aria-label="Buscar en StreamFlix" />
        <i className="fa-solid fa-magnifying-glass"></i>
      </div>

    </nav><img src="/imgs/masking-tape.png" className='tape-navbar'></img></>

  );
}
