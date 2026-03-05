// frontend/src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Добавляем авторизацию из localStorage
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('currentUser');
  if (user) {
    config.headers.Authorization = user;
  }
  return config;
});

export const apiService = {
  // Пользователи
  getUsers: () => api.get('/users'),
  getUserByName: (name) => api.get(`/users/by-name/${name}`),
  
  // Заявки
  getRequests: (params) => api.get('/requests', { params }),
  getRequest: (id) => api.get(`/requests/${id}`),
  createRequest: (data) => api.post('/requests', data),
  
  // Действия с заявками
  assignMaster: (id, masterId) => 
    api.put(`/requests/${id}/assign`, { masterId }),
  takeRequest: (id, masterId) => 
    api.post(`/requests/${id}/take`, { masterId }),
  completeRequest: (id, masterId) => 
    api.post(`/requests/${id}/complete`, { masterId }),
  cancelRequest: (id) => 
    api.post(`/requests/${id}/cancel`)
};

export default apiService;