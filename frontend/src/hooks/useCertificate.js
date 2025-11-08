import { useQuery } from "@tanstack/react-query";
import { getAllCertificates } from "../services/QuizServices";

export default function useCertificate() {
    return useQuery({
        queryKey : ['certificate'],
        queryFn : () => getAllCertificates()
    });
}

