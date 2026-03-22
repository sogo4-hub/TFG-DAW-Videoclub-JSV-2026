import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMediaUrl } from '../../api/peliculasApi';
import { addFavorito, removeFavorito } from '../../api/favoritosApi';
import { crearAlquiler } from '../../api/alquileresApi';
import './PeliculaCard.css';

const PeliculaCard = ({ pelicula, isLogged, initialFavorito = false, yaAlquilada = false }) => {
  const navigate = useNavigate();
  const [isFavorito, setIsFavorito] = useState(initialFavorito);
  const [loading, setLoading] = useState(false);

  const handleAddFavorito = async (e) => {
    e.stopPropagation();
    if (loading) return;
    try {
      setLoading(true);
      await addFavorito(pelicula.id);
      setIsFavorito(true);
    } catch (error) {
      console.error('Error al añadir favorito:', error);
      alert('Error al añadir a favoritos');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorito = async (e) => {
    e.stopPropagation();
    if (loading) return;
    try {
      setLoading(true);
      await removeFavorito(pelicula.id);
      setIsFavorito(false);
    } catch (error) {
      console.error('Error al quitar favorito:', error);
      alert('Error al quitar favorito');
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
      navigate('/mis-alquileres');
    } catch (error) {
      console.error('Error al alquilar:', error);
      alert('Error al alquilar la película');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pelicula-card">
      <img
        src={getMediaUrl(pelicula.urlImagen)}
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
            onClick={isFavorito ? handleRemoveFavorito : handleAddFavorito}
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