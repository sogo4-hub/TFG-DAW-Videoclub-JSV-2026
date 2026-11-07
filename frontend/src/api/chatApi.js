import axiosClient from './axiosClient';

// Obtiene el historial de mensajes del usuario logueado
export const getHistorialChat = async () => {
  const response = await axiosClient.get('/api/chat/historial');
  return response.data;
};