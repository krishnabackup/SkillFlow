import api from "./api";

export const getProfile = async () => await api.get('/users/me')
export const updateProfile = async (payload) => await api.put('/users/me', payload);


