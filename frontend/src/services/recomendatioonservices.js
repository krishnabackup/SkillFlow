import api from "./api";


export const fetchRecomendations = async({page=1,limit=12}) => {
  const res = await api.get("/users/me/recommendation",{
    params : {page,limit}
  });
  return res.data
}