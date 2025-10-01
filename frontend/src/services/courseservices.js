import api from "../services/api"

export const fetchcourse = async({page=1,query="",skill ="",difficulty=""}) =>
{
 const res = await api.get("/courses",{
    params : {page,q:query,skill,difficulty}
 });
 return res.data;
}