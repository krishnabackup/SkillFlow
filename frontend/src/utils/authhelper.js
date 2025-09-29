import { jwtDecode } from "jwt-decode";

export const setToken = (token) => {
    localStorage.setItem('token',token)
}

export const getToken = () => {
    const token = localStorage.getItem('token');
    return token
}

export const getUserRole = () => {
    const token = getToken();
    if(!token) return null;

    const decode = jwtDecode(token);
    return decode.role;
};

export const isAuthenticated = () => {
    return !!getToken();
}

export const logout = () => {
  localStorage.removeItem('token');
};