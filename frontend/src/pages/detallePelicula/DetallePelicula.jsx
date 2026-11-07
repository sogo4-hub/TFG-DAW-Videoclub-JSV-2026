import { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getPeliculas, getMediaUrl } from '../../api/peliculasApi';
import axiosClient from '../../api/axiosClient';
import './DetallePelicula.css';

const DetallePelicula = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const videoRef = useRef(null);

  const [pelicula, setPelicula] = useState(state?.pelicula || null);
  const [loading, setLoading] = useState(!state?.pelicula);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);

  // cargar datos peli
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

  //con tmdb-----
  //descarga el vídeo con axios (lleva el token JWT) y crea una URL en memoria
  useEffect(() => {
    if (!pelicula?.urlVideo) return;

    axiosClient.get(pelicula.urlVideo, { responseType: 'blob' })
      .then(res => {
        const url = URL.createObjectURL(res.data);
        setVideoUrl(url);
      })
      .catch(() => setError('No tienes permiso para ver este vídeo o no tienes un alquiler activo.'));

    // Limpia la URL en memoria al salir de la página
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [pelicula]);

  if (loading) return <div className="detalle-loading">Cargando...</div>;
  if (error) return <div className="detalle-error">{error}</div>;
  if (!pelicula) return null;

  const posterUrl = getMediaUrl(pelicula.urlImagen, 'w500');


  // //codigo antiguo sin tmdb
  // <video controls autoPlay poster={posterUrl} className="detalle-video">
  //   <source src={getMediaUrl(pelicula.urlVideo)} type="video/mp4" />
  // </video>
  return (
    <div className="detalle-container">
      {pelicula.urlVideo ? (
        videoUrl ? (
          <video
            ref={videoRef}
            controls
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            autoPlay
            poster={posterUrl}
            className="detalle-video"
          >
            <source src={videoUrl} type="video/mp4" />
            Este navegador no soporta la reproducción de vídeo.
          </video>
        ) : (
          <div className="detalle-loading">Cargando vídeo...</div>
        )
      ) : (
        <div className="detalle-sin-video">
          <p>Vídeo no disponible todavía...</p>
        </div>
      )}
    </div>
  );
};

export default DetallePelicula;