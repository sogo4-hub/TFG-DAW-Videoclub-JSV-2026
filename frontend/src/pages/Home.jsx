import React from 'react';
import { Link } from 'react-router-dom';

{/*ESTA ES UNA PLANTILLLA, ESTÁ MAL-----------*/ }


const Home = () => {
  return (
    <div>
      <section>
        <h1>¡Bienvenido a StreamFlix!</h1>
        <p>El mejor videoclub online. Alquila películas por solo 48h.</p>
      </section>

      {/* Películas Destacadas - PÚBLICO según PDF */}
      <section>
        <h2>Películas Destacadas</h2>
        <div>
          {/* Aquí PeliculaCard cuando exista */}
          <div>Película 1</div>
          <div>Película 2</div>
          <div>Película 3</div>
          <div>Película 4</div>
        </div>
        <Link to="/catalogo">Ver todo el catálogo</Link>
      </section>
    </div>
  );
};

export default Home;
