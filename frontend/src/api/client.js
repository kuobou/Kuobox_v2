import axios from 'axios';

const client = axios.create({
  baseURL: '/api'
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('relay_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('relay_token');
      window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);

export default client;
