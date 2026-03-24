import axiosClient from './axiosClient';

export const getFavoritos = async () => {
  const response = await axiosClient.get('/api/favoritos');
  return response.data;
};

export const toggleFavorito = async (peliculaId) => {
  const response = await axiosClient.post(`/api/favoritos/${peliculaId}`);
  return response.data;
};