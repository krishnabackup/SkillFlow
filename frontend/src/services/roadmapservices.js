import api from "./api"

export const generateRoadmap =  async(goal) => {
  const res = await api.post('/users/me/roadmap',{goal : goal.goal});
  return res.data;
}

export const getRoadmap = async() => {
    const res = await api.get('/users/me/roadmap');
    return res.data;
}


export const getPathById = async(pathId) => {
    const res = await api.get(`/users/me/roadmap/${pathId}`);
    return res;
}