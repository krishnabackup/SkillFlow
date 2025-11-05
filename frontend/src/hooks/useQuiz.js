import { useMutation, QueryClient } from "@tanstack/react-query";
import { generateQuiz } from "../services/certificateServices";

export const useGenerateQuiz = () => {
    const qc = new QueryClient();
    return useMutation({
        mutationFn : (topic) => generateQuiz(topic),
        onSuccess : qc.invalidateQueries('')
    })
}