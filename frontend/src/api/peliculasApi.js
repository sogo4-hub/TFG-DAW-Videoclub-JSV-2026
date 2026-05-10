import axiosClient from './axiosClient';

const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p';

export const getMediaUrl = (path, size = 'w500') => {
  if (!path) return null;
    if (path.startsWith('/api/media/')) {
    return `http://localhost:8080${path}`;
  }

  return `${TMDB_IMG_BASE}/${size}${path}`;

};

export const getPeliculas = async () => {
  const response = await axiosClient.get('/api/peliculas');
  return response.data;
};

export const getPeliculaById = async (id) => {
  const response = await axiosClient.get(`/api/peliculas/${id}`);
  return response.data;
};

export const savePelicula = async (pelicula) => {
  const response = await axiosClient.post(
    '/api/peliculas',
    pelicula
  );

  return response.data;
};


export const deletePelicula = async (id) => {
    return await axiosClient.delete(`/api/peliculas/${id}`);
};