import { useEffect, useState } from "react"
import { confirmEmailVerification } from "../services/api"
import { useNavigate , useSearchParams} from "react-router-dom"
export default function VerifyEmailPage(){
    const nav = useNavigate();
    const [searchParams] = useSearchParams();
    const [message,setMessage] =  useState("Verifying your email...");
    const [isSuccess,setIsSuccess] = useState(false);
    useEffect(() => {
     const verifyEmail = async () => {
        const token =  searchParams.get('token');
        if(!token){
            setMessage("Invalid verification link.");
            setIsSuccess(false);
            return;
        }

     try {
        // Call backend to verify email
        const res =  await confirmEmailVerification(token);
        if(res.status === 200){
            const email = res.data.email;
            const saved = JSON.parse(localStorage.getItem('registrationBeforeVerification')) || {};
            saved.email = email;
            saved.verified = true;
            localStorage.setItem('registrationBeforeVerification',JSON.stringify(saved));
           nav('/register');
        }
        else{
            alert("Email verification failed. Please try again.");
            nav('/register');
        }
     }
     catch (error) {
       console.error("Email verification failed:", error);
     }
     }
     verifyEmail();
    },[nav, searchParams]);
    return(
        <>
        <div className="flex justify-center items-center ">
            {
                isSuccess ? (
                    <h1 className="text-green-500 text-lg">{message}</h1>
                ) : (
                    <h1 className="text-black text-lg">{message}</h1>
                )
}
        </div>
        </>
    )
}