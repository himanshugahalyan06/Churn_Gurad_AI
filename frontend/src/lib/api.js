import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000,
});

export const predict = (formData) => API.post('/predict', formData);
export const explain = (formData) => API.post('/explain', formData);
export const getMetrics = () => API.get('/metrics');
export const getHealth = () => API.get('/health');

export default API;
