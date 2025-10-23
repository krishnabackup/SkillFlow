import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

//attach token automatically if present 

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registeruser = async (userData) => {
    const res = await api.post("/auth/register", userData);
    return res;
};


export const loginUser = async (credentials) => {
  const res = await api.post("/auth/login",credentials);
  return res;
}


export const verifyEmail = async (email) => {
    const res = await api.post('/auth/email-verification/send-verification-email', { email });
    return res.data;
}

export const confirmEmailVerification = async (token) => {
    const res = await api.get(`/auth/email-verification/verify-email?token=${token}`);
    return res;
} 


export const requestPasswordReset = async (email) => {
    const res = await api.post('/auth/password-reset/request-reset', { email });
    return res;
}

export const validateResetToken = async (token) => {
  const res = await api.get(`/auth/forgetPassword?token=${token}`);
  return res;
}
export const resetPassword = async (token ,newPassword) => {
    const res = await api.post('/auth/forgetPassword', { token, newPassword });
    return res;
}

export default api;