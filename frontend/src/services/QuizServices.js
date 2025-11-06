import { getToken } from "../utils/authhelper";
import api from "./api";

export const generateQuiz = async(id) => {
 const res = await api.get(`/courses/${id}/quiz`);
 return res.data;
}

export const submitQuiz = async(id,score) => {
    const token = getToken();
    const res = await api.post(`/courses/${id}/quiz/submit`,{score},{
        headers : {Authorization : `Bearer ${token}`},
        responseType : 'blob'
    });
    console.log(res);
    return res.data;
}


