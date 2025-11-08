import { getToken } from "../utils/authhelper";
import api from "./api";

export const generateQuiz = async(id) => {
 const res = await api.get(`/courses/${id}/quiz`);
 return res.data;
}

export const submitQuiz = async(id,score) => {
    const res = await api.post(`/courses/${id}/quiz/submit`,{score});
    return res.data;
}

export const downloadPdf = async(cert_id) => {
    const token = getToken();
    const res = await api.get(`/courses/quiz/downloadPdf/${cert_id}`,{
        headers : {Authorization : `Bearer ${token}`},
        responseType : "blob"
    });
    return res;
}

export const getAllCertificates = async() => {
    const res = await api.get("users/me/certficates");
    return res.data;
}



