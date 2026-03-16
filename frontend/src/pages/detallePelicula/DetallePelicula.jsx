import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPeliculaById, getMediaUrl } from '../../api/peliculasApi';

const DetallePelicula = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [pelicula, setPelicula] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPelicula = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPeliculaById(id);
        setPelicula(data);
      } catch (err) {
        setError(err.message || 'Error al cargar la película');
      } finally {
        setLoading(false);
      }
    };

    fetchPelicula();
  }, [id]);

  if (loading) return <p>Cargando película...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!pelicula) return null;

  return (
    <div>
      <button onClick={() => navigate('/catalogo')}>← Volver al catálogo</button>

      <video
        ref={videoRef}
        controls
        autoPlay
        poster={getMediaUrl(pelicula.urlImagen)}
        style={{ width: '100%', display: 'block' }}
      >
        <source src={getMediaUrl(pelicula.urlVideo)} type="video/mp4" />
        Tu navegador no soporta la reproducción de vídeo.
      </video>

      <h1>{pelicula.titulo}</h1>
      <p>
        <strong>{pelicula.anio}</strong> · {pelicula.genero} · Dir. {pelicula.director}
      </p>
      <p>{pelicula.sinopsis}</p>
    </div>
  );
};

export default DetallePelicula;