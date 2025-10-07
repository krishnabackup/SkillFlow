import api from "./api";

export const getUserEnrolledCourses = async () => {
  const res = await api.get("/users/me/enrollments");
  return res.data;
}

export const addUserEnrolledCourses = async (courseId) => {
    const res = await api.post("/users/me/enrollments",{courseId} );
    return res;
}

export const deleteEnrolledCourses = async (courseId) => {
    const res = await api.delete(`/users/me/enrollments/${courseId}`);
    return res.data;
}

export const updateEnrolledCourses = async (courseId,payload) => {
 const res = await api.patch(`/users/me/enrollments/${courseId}/progress`,payload);
 return res.data;
}