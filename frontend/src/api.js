import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000' });

API.interceptors.request.use(req => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const authAPI = {
  register: (data) => API.post('/api/auth/register', data),
  login: (data) => API.post('/api/auth/login', data),
  getMe: () => API.get('/api/auth/me')
};

export const postAPI = {
  getAll: () => API.get('/api/posts'),
  create: (data) => API.post('/api/posts', data)
};