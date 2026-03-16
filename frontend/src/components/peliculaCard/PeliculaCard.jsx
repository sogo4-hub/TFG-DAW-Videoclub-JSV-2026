import { useNavigate } from 'react-router-dom';
import { getMediaUrl } from '../../api/peliculasApi';

const PeliculaCard = ({ pelicula }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/pelicula/${pelicula.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <img
        src={getMediaUrl(pelicula.urlImagen)}
        alt={`Cartel de ${pelicula.titulo}`}
        loading="lazy"
        onError={(e) => {
          e.target.src = 'https://placehold.co/300x450?text=Sin+imagen';
        }}
        style={{ width: '100%', display: 'block' }}
      />
      <h3>{pelicula.titulo}</h3>
      <p>{pelicula.director} · {pelicula.anio}</p>
      <p>{pelicula.genero}</p>
    </div>
  );
};

export default PeliculaCard;