import axiosClient from './axiosClient';

export const getPeliculas = async () => {
  const response = await axiosClient.get('/api/peliculas');
  return response.data;
};

export const getPeliculaById = async (id) => {
  const response = await axiosClient.get(`/api/peliculas/${id}`);
  return response.data;
};

// Construye la URL completa para imágenes y vídeos
export const getMediaUrl = (path) => `http://localhost:8080${path}`;