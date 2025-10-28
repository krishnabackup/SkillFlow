import api from "./api";

export const getSummary = async() => {
    const res = await api.get("/admin/analytics/summary");
    return res.data;
}

export const getTopCourses = async({limit}) => {
    const res = await api.get("/admin/analytics/top-courses",{
        params : {limit}
    });
    return res.data
}

export const getEnrollemtsStatus = async({range}) => {
  const res = await api.get("/admin/analytics/enrollments",{
    params : {range}
  })
  return res.data
}
