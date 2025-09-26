import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

export const registeruser = async (userData) => {
  const res = await api.post("/auth/register",userData);
  return res.data;
}


export const loginUser = async (credentials) => {
  const res = await api.post("/auth/login",credentials);
  return res.data;
}

export default api;