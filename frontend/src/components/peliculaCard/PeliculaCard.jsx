import { useState } from 'react';
import { getMediaUrl } from '../../api/peliculasApi';
import { toggleFavorito } from '../../api/favoritosApi';
import { crearAlquiler } from '../../api/alquileresApi';
import './PeliculaCard.css';

const PeliculaCard = ({ pelicula, isLogged, initialFavorito = false, yaAlquilada = false, onAlquilar }) => {
  const [isFavorito, setIsFavorito] = useState(initialFavorito);
  const [loading, setLoading] = useState(false);

  const handleToggleFavorito = async (e) => {
    e.stopPropagation();
    if (loading) return;
    try {
      setLoading(true);
      await toggleFavorito(pelicula.id);
      setIsFavorito(prev => !prev); // cambia al estado contrario
    } catch (error) {
      console.error('Error al cambiar favorito:', error);
      alert('Error al cambiar favorito');
    } finally {
      setLoading(false);
    }
  };

  const handleAlquilar = async (e) => {
    e.stopPropagation();
    if (loading) return;
    try {
      setLoading(true);
      await crearAlquiler(pelicula.id);
      onAlquilar?.(pelicula.id); // avisa al padre para que actualice la lista
    } catch (error) {
      console.error('Error al alquilar:', error);
      alert('Error al alquilar la película');
    } finally {
      setLoading(false);
    }
  };

  // urlImagen puede ser ruta relativa TMDB (/xxx.jpg) o interna (/api/media/...)
  const posterUrl = getMediaUrl(pelicula.urlImagen, 'w500');

  return (
    <div className="pelicula-card">
      <img
        src={posterUrl}
        alt={pelicula.titulo}
        loading="lazy"
        onError={(e) => {
          e.target.src = 'https://placehold.co/300x450/cccccc/666666?text=Sin+imagen';
        }}
        className="pelicula-imagen"
      />

      <h3 className="pelicula-titulo">{pelicula.titulo}</h3>

      <div className="pelicula-info">
        <p className="pelicula-meta">
          <strong>{pelicula.director}</strong> · {pelicula.anio}
        </p>
        <p className="pelicula-genero">{pelicula.genero}</p>
      </div>

      <p className="pelicula-sinopsis">
        {pelicula.sinopsis || 'Sinopsis no disponible'}
      </p>

      {isLogged && (
        <div className="pelicula-botones">
          <button
            className={`btn-favorito ${isFavorito ? 'btn-favorito-activo' : ''} ${loading ? 'btn-loading' : ''}`}
            onClick={handleToggleFavorito}
            disabled={loading}
          >
            {loading ? '...' : isFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          </button>

          <button
            className={`btn-alquilar ${yaAlquilada ? 'btn-alquilada' : ''} ${loading ? 'btn-loading' : ''}`}
            onClick={handleAlquilar}
            disabled={loading || yaAlquilada}
          >
            {yaAlquilada ? 'Ya alquilada' : loading ? 'Alquilando...' : 'Alquilar'}
          </button>
        </div>
      )}

      {!isLogged && (
        <div className="pelicula-no-logged">
          <p>Inicie sesión para alquilar.</p>
        </div>
      )}
    </div>
  );
};

export default PeliculaCard;