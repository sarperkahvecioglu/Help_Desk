import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to requests
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

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Client API calls
export const clientAPI = {
  createRequest: (requestData) => api.post('/client/request/', requestData),
  getMyRequests: (params) => api.get('/client/my-requests/', { params }),
  getSingleRequest: (requestId) => api.get(`/client/request/${requestId}`),
  updateRequest: (requestId, updateData) => api.put(`/client/request/${requestId}`, updateData),
};

// Support API calls
export const supportAPI = {
  getAllRequests: (params) => api.get('/support/requests/', { params }),
  getClients: () => api.get('/support/clients/'),
  getSingleRequest: (requestId) => api.get(`/support/request/${requestId}`),
  updateRequestStatus: (requestId, statusData) => api.put(`/support/request/${requestId}/status`, statusData),
};

export default api; 