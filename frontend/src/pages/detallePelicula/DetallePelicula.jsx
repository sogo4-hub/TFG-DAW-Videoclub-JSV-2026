import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getPeliculaById, getMediaUrl } from '../../api/peliculasApi';
import './DetallePelicula.css';

const DetallePelicula = () => {
  const { id } = useParams();
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

  if (loading) return <div className="detalle-loading">Cargando película...</div>;
  if (error) return <div className="detalle-error">Error: {error}</div>;
  if (!pelicula) return null;

  return (
    <div className="detalle-container">
      <div className="detalle-hero">
        <div className="detalle-poster">
          <img
            src={getMediaUrl(pelicula.urlImagen)}
            alt={pelicula.titulo}
            className="detalle-imagen"
          />
        </div>

        <div className="detalle-video-container">
          <video
            ref={videoRef}
            controls
            autoPlay
            poster={getMediaUrl(pelicula.urlImagen)}
            className="detalle-video"
          >
            <source src={getMediaUrl(pelicula.urlVideo)} type="video/mp4" />
            Error de navegador. Este no navegador no soporta la reproducción de vídeo.
          </video>
        </div>
      </div>

      <div className="detalle-contenido">
        <h1 className="detalle-titulo">{pelicula.titulo}</h1>

        <div className="detalle-meta">
          <span className="detalle-anio">{pelicula.anio}</span>
          <span className="detalle-genero">{pelicula.genero}</span>
          <span className="detalle-director">{pelicula.director}</span>
        </div>

        <p className="detalle-sinopsis">{pelicula.sinopsis}</p>
      </div>
    </div>
  );
};

export default DetallePelicula;
