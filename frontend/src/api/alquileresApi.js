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

// Marca el alquiler como reproducida cuando el usuario empieza a ver la película
export const marcarReproducida = async (alquilerId) => {
  const response = await axiosClient.patch(`/api/alquileres/${alquilerId}/reproducida`);
  return response.data;
};