import api from "../services/api"

export const fetchcourse = async({page=1,limit=10,query="",skill ="",difficulty=""}) =>
{
 const res = await api.get("/courses",{
    params : {page,limit,q:query,skill,difficulty}
 });
 return res.data;
}

export const fetchcourseAdmin = async({page=1,query ="",limit=""}) => {
   const res = await api.get("/courses",{
      params : {page,q:query,limit}
   });
   return res.data
}

export const createCourse = async(payload) => {
   console.log(payload);
   const res = await api.post("/courses",payload);
   return res.data;
}

export const deleteCourses = async(id) => {
   const res = await api.delete(`/courses/${id}`);
   return res.data;
}

export const updateCourses = async(id,payload) => {
   const res = await api.put(`/courses/${id}`,payload);
   return res.data;
}

export const getCourseById = async(id) => {
   const res = await api.get(`/courses/${id}`);
   return res.data;
}

