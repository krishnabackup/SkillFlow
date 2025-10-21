import api from "./api";

export const getProfile = async () => await api.get('/users/me')
export const updateProfile = async (payload) => await api.put('/users/me', payload);

export const getProfileAdmin = async () => {
    const res = await api.get('/admin/users')
    return res.data;
}
export const updateProfileAdmin = async (user_id,role) => {
    const res = await api.put(`/admin/users/${user_id}/role`, role);
    return res.data;
}

export const createUserByAdmin = async (payload) => {
    const res = await api.post('/auth/register',payload);
    return res.data
} 


