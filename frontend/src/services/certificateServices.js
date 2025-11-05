import api from "./api";

export const generateQuiz = async(id,topic) => {
 const res = await api.post(`/courses/${id}/quiz`,{topic});
 return res.data;
}

export const sumitQuiz = async(id,payload) => {
    const res = await api.post(`/courses/${id}/quizsubmit`,payload);
    return res.data;
}


