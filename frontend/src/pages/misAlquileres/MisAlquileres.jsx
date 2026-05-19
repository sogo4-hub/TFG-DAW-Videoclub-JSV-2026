import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMediaUrl } from '../../api/peliculasApi';
import { getMisAlquileres, cancelarAlquiler, marcarReproducida } from '../../api/alquileresApi';
import './MisAlquileres.css';

const MisAlquileres = () => {
  const [alquileres, setAlquileres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlquileres = async () => {
      try {
        setLoading(true);
        // El backend devuelve: { pelicula: { id, titulo, ... }, reproducida: boolean }
        const data = await getMisAlquileres();
        // Aplanamos el objeto para que el JSX acceda directamente a los campos
        const aplanados = data.map(item => ({
          ...item.pelicula,
          reproducida: item.reproducida,
        }));
        setAlquileres(aplanados);
      } catch (err) {
        setError(err.message || 'Error al cargar tus alquileres');
      } finally {
        setLoading(false);
      }
    };
    fetchAlquileres();
  }, []);

  const handleCancelar = async (alquiler) => {
    try {
      // El endpoint de cancelar recibe el id de la PELÍCULA
      await cancelarAlquiler(alquiler.id);
      setAlquileres(prev => prev.filter(a => a.id !== alquiler.id));
    } catch (err) {
      alert('Error al cancelar el alquiler: ' + err.message);
    }
  };

  // El vídeo es un stream directo desde el backend (/api/media/stream/{id}).
  // Navegamos a la página de detalle donde el <video> hace streaming con el JWT correcto.
  const handleVerPelicula = async (alquiler) => {
    try {
      // Marcamos como reproducida — el backend recibe el id de la PELÍCULA
      await marcarReproducida(alquiler.id);
      // Actualizamos el estado local para ocultar el botón cancelar
      setAlquileres(prev =>
        prev.map(a => a.id === alquiler.id ? { ...a, reproducida: true } : a)
      );
    } catch (err) {
      // Si falla el marcado no bloqueamos la reproducción
      console.error('Error al marcar como reproducida:', err);
    }
    navigate(`/pelicula/${alquiler.id}`, { state: { pelicula: alquiler } });
  };

  if (loading) return <p>Cargando tus alquileres...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!alquileres.length) return <p className='sinAlquileres'>Aún no has alquilado nada.</p>;

  return (
    <div className="alquileres-container">
      <h1 className="alquileres-title">Mis alquileres</h1>
      <div className="peliculas-grid">
        {alquileres.map((alquiler) => (
          <div key={alquiler.id} className="alquiler-card">
            <img
              src={getMediaUrl(alquiler.urlImagen, 'w500')}
              alt={`Cartel de ${alquiler.titulo}`}
              className="alquiler-imagen"
              onError={(e) => {
                e.target.src = 'https://placehold.co/300x450?text=Sin+imagen';
              }}
            />
            <h3 className="alquiler-titulo">{alquiler.titulo}</h3>
            <p className="alquiler-meta">
              {alquiler.director} · {alquiler.anio}
            </p>
            <p className="alquiler-genero">{alquiler.genero}</p>

            <button
              type="button"
              className="alquiler-boton"
              onClick={() => handleVerPelicula(alquiler)}
              disabled={!alquiler.urlVideo}
              title={!alquiler.urlVideo ? 'El vídeo aún no está disponible' : ''}
            >
              {alquiler.urlVideo ? 'Ver película' : 'Vídeo no disponible'}
            </button>

            {/* Solo se muestra el botón cancelar si la película no ha sido reproducida */}
            {!alquiler.reproducida && (
              <button
                type="button"
                className="alquiler-boton-cancelar"
                onClick={() => handleCancelar(alquiler)}
              >
                Cancelar alquiler
              </button>
            )}

            {/* Mensaje informativo si ya fue reproducida */}
            {alquiler.reproducida && (
              <p className="alquiler-reproducida">✓ Ya has empezado a ver esta película</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MisAlquileres;