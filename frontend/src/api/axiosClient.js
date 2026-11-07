import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080',
});

axiosClient.interceptors.request.use((config) => {
  // const auth = localStorage.getItem('auth');
  const auth = sessionStorage.getItem('auth')

  if (auth) {
    const { token } = JSON.parse(auth);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default axiosClient;