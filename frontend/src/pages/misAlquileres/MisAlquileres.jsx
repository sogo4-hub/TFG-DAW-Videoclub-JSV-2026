import { useEffect, useState } from 'react';
import { getMediaUrl } from '../../api/peliculasApi';
import { getMisAlquileres } from '../../api/alquileresApi';
import './MisAlquileres.css';

const MisAlquileres = () => {
  const [alquileres, setAlquileres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlquileres = async () => {
      try {
        setLoading(true);
        const data = await getMisAlquileres();
        setAlquileres(data);
      } catch (err) {
        setError(err.message || 'Error al cargar tus alquileres');
      } finally {
        setLoading(false);
      }
    };
    fetchAlquileres();
  }, []);


  const handleCancelar = async (id) => {
    try {
      await cancelarAlquiler(id);
      setAlquileres(prev => prev.filter(a => a.id !== id)); // lo quita de la lista
    } catch (err) {
      alert('Error al cancelar el alquiler');
    }
  };


  if (loading) return <p>Cargando tus alquileres...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!alquileres.length) return <p>Aún no has alquilado nada.</p>;


  return (
    <div className="alquileres-container">
      <h1 className="alquileres-title">Mis alquileres</h1>
      <div className="peliculas-grid">

        {alquileres.map((alquiler) => {

          const pelicula = alquiler.pelicula || alquiler; //-----------depende como devuelve el back

          return (
            <div key={alquiler.id || pelicula.id} className="alquiler-card">
              <img
                src={getMediaUrl(pelicula.urlImagen)}
                alt={`Cartel de ${pelicula.titulo}`}
                className="alquiler-imagen"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/300x450?text=Sin+imagen';
                }}
              />
              <h3 className="alquiler-titulo">{pelicula.titulo}</h3>
              <p className="alquiler-meta">
                {pelicula.director} · {pelicula.anio}
              </p>
              <p className="alquiler-genero">{pelicula.genero}</p>
              <button
                type="button"
                className="alquiler-boton"
                onClick={() => {
                  window.location.href = getMediaUrl(pelicula.urlVideo);
                }}
              >
                Ver película
              </button>

              <button
                type="button"
                className="alquiler-boton-cancelar"
                onClick={() => handleCancelar(alquiler.id)}
              >
                Cancelar alquiler
              </button>

            </div>
          );
        })}
        
      </div>
    </div>
  );
};

export default MisAlquileres;
