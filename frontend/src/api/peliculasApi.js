import axiosClient from './axiosClient';

const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p';

export const getMediaUrl = (path, size = 'w500') => {
  if (!path) return null;
  if (path.startsWith('/api/media/')) {
    return `http://localhost:8080${path}`;
  }
  return `${TMDB_IMG_BASE}/${size}${path}`;
};

// Para el catálogo público — con paginación, búsqueda, género y ordenación
export const getPeliculas = async (
  page = 0,
  size = 16,
  search = '',
  genre = '',
  sort = ''
) => {
  const params = { page, size };
  if (search) params.search = search;
  if (genre) params.genre = genre;
  // Spring Boot lee ?sort=titulo,asc directamente del Pageable
  if (sort) params.sort = sort;

  const response = await axiosClient.get('/api/peliculas', { params });
  return response.data;
};

// Para el dashboard del admin — devuelve todas sin límite de paginación
export const getPeliculasTodas = async () => {
  const response = await axiosClient.get('/api/peliculas/todas');
  return response.data;
};

export const getPeliculaById = async (id) => {
  const response = await axiosClient.get(`/api/peliculas/${id}`);
  return response.data;
};

export const savePelicula = async (pelicula) => {
  const response = await axiosClient.post(
    `/api/peliculas/tmdb/import/${pelicula.tmdbId}`
  );
  return response.data;
};

export const deletePelicula = async (id) => {
  return await axiosClient.delete(`/api/peliculas/${id}`);
};

// Importa una película desde TMDB a través del backend
// La clave de TMDB nunca sale del servidor
export const importarDesdeTmdb = async (tmdbId) => {
  const response = await axiosClient.post(`/api/peliculas/tmdb/import/${tmdbId}`);
  return response.data;
};

export const subirVideoPelicula = async (idInterno, formData) => {
  const response = await axiosClient.patch(`/api/peliculas/${idInterno}/upload-video`, formData);
  return response.data;
};