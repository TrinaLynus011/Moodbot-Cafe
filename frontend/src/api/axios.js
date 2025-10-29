// src/api/axios.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// ✅ attach auth token automatically if present
API.interceptors.request.use((config) => {
  const authData = localStorage.getItem('auth');
  if (authData) {
    const { token } = JSON.parse(authData);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ ADD THIS FUNCTION: for SettingsPage
export const updateUser = async (data) => {
  return API.put('/auth/update', data);
};

// (optional) export more routes later:
export const loginUser = async (data) => API.post('/auth/login', data);
export const signupUser = async (data) => API.post('/auth/signup', data);

export default API;
