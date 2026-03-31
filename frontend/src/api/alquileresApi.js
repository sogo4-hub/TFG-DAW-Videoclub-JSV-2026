import axiosClient from './axiosClient';

export const crearAlquiler = async (peliculaId) => {
  const response = await axiosClient.post(`/api/alquileres/${peliculaId}`);
  return response.data;
};

export const getMisAlquileres = async () => {
  const response = await axiosClient.get('/api/alquileres');
  return response.data;
};

export const cancelarAlquiler = async (id) => {
  const response = await axiosClient.delete(`/api/alquileres/${id}`);
  return response.data;
};