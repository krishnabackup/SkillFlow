import api from "./api";


export const fetchRecomendations = async({page="",limit=""}) => {
  const res = await api.get("/users/me/recommendation",{
    params : {page,limit}
  });
  return res.data
}