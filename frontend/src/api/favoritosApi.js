import axiosClient from './axiosClient';

/**
 * Devuelve la lista de películas marcadas como favoritas
 * del usuario autenticado.
 */
export const getFavoritos = async () => {
  const response = await axiosClient.get('/favoritos');
  // Esperado: array de PeliculaDTO o similar
  return response.data;
};

/**
 * Marca una película como favorita para el usuario actual.
 * @param {number} peliculaId
 */
export const addFavorito = async (peliculaId) => {
  const response = await axiosClient.post('/favoritos', { peliculaId });
  return response.data;
};

/**
 * Elimina una película de favoritos del usuario actual.
 * @param {number} peliculaId
 */
export const removeFavorito = async (peliculaId) => {
  // Puedes usar DELETE /favoritos/{peliculaId} o body JSON,
  // según como lo implementes en el backend.
  const response = await axiosClient.delete(`/favoritos/${peliculaId}`);
  return response.data;
};
