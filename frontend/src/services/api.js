import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});


export const getAuthHeaders = async (token) => ({
  Authorization: `Bearer ${token}`,
});

export const analyzeMRI = async (file, token = null) => {
  const formData = new FormData();
  formData.append('file', file);

  const headers = {
    'Content-Type': 'multipart/form-data',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return api.post('/api/analyze', formData, { headers });
};


export const getScanHistory = async (token = null) => {
  const headers = token ? await getAuthHeaders(token) : {};
  const response = await api.get('/api/scans', { headers });
  return response.data;
};

export const getScanById = async (id, token = null) => {
  const headers = token ? await getAuthHeaders(token) : {};
  const response = await api.get(`/api/scans/${id}`, { headers });
  return response.data;
};

export const generateReport = async (id, token = null) => {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await api.get(`/api/reports/${id}/pdf`, {
    headers,
    responseType: 'blob',
  });
  return response.data;
};


export default api;
