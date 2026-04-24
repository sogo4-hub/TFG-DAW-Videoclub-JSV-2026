import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMediaUrl } from '../../api/peliculasApi';
import { getMisAlquileres, cancelarAlquiler } from '../../api/alquileresApi';
import './MisAlquileres.css';

const MisAlquileres = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      alert('Error al cancelar el alquiler', err.message);
    }
  };

  // El vídeo es un stream directo desde el backend (/api/media/stream/{id}).
  // Navegamos a la página de detalle donde el <video> hace streaming con el JWT correcto.
  const handleVerPelicula = (peliculaId) => {
    navigate(`/pelicula/${peliculaId}`);
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
              src={getMediaUrl(pelicula.urlImagen, 'w500')}
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
              onClick={() => handleVerPelicula(pelicula.id)}
              disabled={!pelicula.urlVideo}
              title={!pelicula.urlVideo ? 'El vídeo aún no está disponible' : ''}
            >
              {pelicula.urlVideo ? 'Ver película' : 'Vídeo no disponible'}
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