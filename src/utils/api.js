import axios from 'axios';

const API_BASE_URL = 'https://api-inventory.isavralabel.com/rizkyprovidervisa/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const countriesAPI = {
  getAll: () => api.get('/countries'),
  getById: (id) => api.get(`/countries/${id}`),
  create: (data) => api.post('/countries', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/countries/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/countries/${id}`)
};

export const visaTypesAPI = {
  getAll: (countryId) => api.get('/visa-types', { params: { country_id: countryId } }),
  create: (data) => api.post('/visa-types', data),
  update: (id, data) => api.put(`/visa-types/${id}`, data),
  delete: (id) => api.delete(`/visa-types/${id}`)
};

export const visaCategoriesAPI = {
  getAll: (visaTypeId) => api.get('/visa-categories', { params: { visa_type_id: visaTypeId } }),
  create: (data) => api.post('/visa-categories', data),
  update: (id, data) => api.put(`/visa-categories/${id}`, data),
  delete: (id) => api.delete(`/visa-categories/${id}`)
};

export const visaDetailsAPI = {
  getAll: (visaCategoryId) => api.get('/visa-details', { params: { visa_category_id: visaCategoryId } }),
  create: (data) => api.post('/visa-details', data),
  update: (id, data) => api.put(`/visa-details/${id}`, data),
  delete: (id) => api.delete(`/visa-details/${id}`)
};

export const settingsAPI = {
  getAll: () => api.get('/settings'),
  update: (data) => api.put('/settings', data)
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats')
};

export default api;
