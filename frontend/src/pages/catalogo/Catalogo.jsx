import { useState } from 'react';
import usePeliculas from '../../hooks/usePeliculas';

const Catalogo = () => {
  const {loading, error } = usePeliculas();
 
  if (loading) return <p>Cargando catálogo...</p>;

  if (error)
    return (
      <p>
        Error: {error}. Asegúrate de que el backend está corriendo en localhost:8080.
      </p>
    );

  return (
    <div>
      <h1>Catálogo de películas</h1>
    </div>
  );
};

export default Catalogo;