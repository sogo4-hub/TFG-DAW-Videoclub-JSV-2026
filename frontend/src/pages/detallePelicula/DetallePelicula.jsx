import { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getPeliculas, getMediaUrl } from '../../api/peliculasApi';
import './DetallePelicula.css';

const DetallePelicula = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const videoRef = useRef(null);

  const [pelicula, setPelicula] = useState(state?.pelicula || null);
  const [loading, setLoading] = useState(!state?.pelicula);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (state?.pelicula) return;

    const fetchPelicula = async () => {
      try {
        setLoading(true);
        setError(null);
        const todas = await getPeliculas();
        const encontrada = todas.find(p => p.id === Number(id));
        if (!encontrada) throw new Error('Película no encontrada');
        setPelicula(encontrada);
      } catch (err) {
        setError(err.message || 'Error al cargar la película');
      } finally {
        setLoading(false);
      }
    };

    fetchPelicula();
  }, [id, state]);

  if (loading) return <div className="detalle-loading">Cargando...</div>;
  if (error) return <div className="detalle-error">Error: {error}</div>;
  if (!pelicula) return null;

  return (
    <div className="detalle-container">
      {pelicula.urlVideo ? (
        <video
          ref={videoRef}
          controls
          autoPlay
          className="detalle-video"
        >
          <source src={getMediaUrl(pelicula.urlVideo)} type="video/mp4" />
          Este navegador no soporta la reproducción de vídeo.
        </video>
      ) : (
        <div className="detalle-sin-video">
          <p>🎬 Vídeo no disponible todavía.</p>
        </div>
      )}
    </div>
  );
};

export default DetallePelicula;