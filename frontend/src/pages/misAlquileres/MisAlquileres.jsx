import { useEffect, useState } from 'react';
import { getMediaUrl } from '../../api/peliculasApi';
import { getMisAlquileres, cancelarAlquiler } from '../../api/alquileresApi';
import axiosClient from '../../api/axiosClient';
import './MisAlquileres.css';

const MisAlquileres = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlquileres = async () => {
      try {
        setLoading(true);
        const data = await getMisAlquileres();
        setPeliculas(data);
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
      setPeliculas(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Error al cancelar el alquiler');
    }
  };

  const handleVerPelicula = async (urlVideo) => {
    try {
      const response = await axiosClient.get(urlVideo, {
        responseType: 'blob', // descarga el vídeo como blob
      });
      const blob = new Blob([response.data], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank'); // abre en nueva pestaña
    } catch (err) {
      alert('Error al reproducir la película. Comprueba tu alquiler.');
    }
  };

  if (loading) return <p>Cargando tus alquileres...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!peliculas.length) return <p>Aún no has alquilado nada.</p>;

  return (
    <div className="alquileres-container">
      <h1 className="alquileres-title">Mis alquileres</h1>
      <div className="peliculas-grid">
        {peliculas.map((pelicula) => (
          <div key={pelicula.id} className="alquiler-card">
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
              onClick={() => handleVerPelicula(pelicula.urlVideo)}
            >
              Ver película
            </button>
            <button
              type="button"
              className="alquiler-boton-cancelar"
              onClick={() => handleCancelar(pelicula.id)}
            >
              Cancelar alquiler
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MisAlquileres;