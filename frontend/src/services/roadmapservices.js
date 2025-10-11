import api from "./api"

export const generateRoadmap =  async() => {
  const res = await api.post('/users/me/roadmap');
  return res.data;
}

export const getRoadmap = async() => {
    const res = await api.get('/users/me/roadmap');
    return res.data;
}

