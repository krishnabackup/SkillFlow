
import api from "./api"

export const getProgress = async(courseId) => {
  const res = await api.get(`/users/me/enrollments/progress/${courseId}`);
  return res.data;
} 

export const updateProgress = async(courseId,progress,lastTime) => {
    console.log(courseId);
    const res = await api.patch("/users/me/enrollments/progress",{courseId,progress,lastTime});
    return res.data;
}


