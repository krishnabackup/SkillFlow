import Navbar from "../../../components/NavBar";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { use, useEffect, useState } from "react";
import { setToken , getUserRole } from "../../../utils/authhelper";
import { loginUser } from "../../../services/api";
import { requestPasswordReset, validateResetToken , resetPassword} from "../../../services/api";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useLocation,useNavigate} from "react-router-dom";
const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email required"),
    newPassword: yup.string().min(6, "At least 6 characters").matches(/(.*[a-z].*){1,}/, 'Password must contain at least one lowercase letters')
  .matches(/(.*[A-Z].*){1,}/, 'Password must contain at least one uppercase letters')
  .matches(/(.*\d.*){2,}/, 'Password must contain at least two numbers').when('isVeriified', {
        is: true,
        then: yup.string().required('New Password required')
    }),
    confirmNewPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Passwords must match').when('isVeriified', {
        is: true,
        then: yup.string().required('Confirm New Password required')
    }),
})
const links = [
    {
        label : "Login", link : '/'

    },
]
export default function ForgetPasswordPage() {
    const nav = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const { register, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });
    const [serverError, setServerError] = useState('');
    const [isVeriified, setIsVeriified] = useState(false);
    useEffect(() => {
  const verifyToken = async (token) => {
    if (token) {
      const res = await validateResetToken(token); // Call API function, not local
      if (res.status === 200) {
        toast.success("Token verified. You can now reset your password.");
        const email = res.data.email;
        setValue('email', email);
        setIsVeriified(true);
        console.log(email);
      } else {
        toast.error("Invalid or expired token.");
      }
    }
  }
  verifyToken(token);
}, [token, setValue]);
    const onSubmit = async (data) => {
        setServerError('');
        if(token && isVeriified){
            try {
                const res = await resetPassword(token, data.newPassword);
                if(res.status === 200){
                    toast.success("Password reset successful. You can now log in with your new password.");
                    const res = await loginUser({email : data.email, password: data.newPassword});
                    setToken(res.data.token);
                    const role = getUserRole();
                    if(role == "admin") {
                nav('/admin');
                }
                else{
                    nav('/home');
                }
                } 
                
            } catch (error) {
                const msg = error?.response?.data?.message || 'Password reset failed';
                setServerError(msg);
                return;
            }
        }
        else {
          const res = await requestPasswordReset(data.email);
          if(res.status === 200){
            toast.success("If the email is registered, a reset link has been sent.");
            }
          else {
                toast.error("Failed to send reset link. Please try again.");
               }
            }
}
  return (
    <>
    <Navbar links={links}></Navbar>
    <ToastContainer
        position="top-center"
        className="px-4 py-4 mt-4"
        autoClose={5000}
        closeOnClick={false}
        theme = "dark"
        pauseOnHover
        transition = {Bounce}
    />
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-indigo-950 to-neutral-900">
          <div className="w-full max-w-md p-8 rounded-2xl mb-44 bg-white/10 border border-white/30 shadow-xl backdrop-blur-xl
                          bg-clip-padding text-white
                          dark:bg-black/40 dark:border-white/20 transition">
            <h1 className="text-2xl font-bold text-center mb-6 text-blue-200 drop-shadow">
              Forget Password
            </h1>
             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && <div className="text-red-600 text-sm">{serverError}</div>}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input {...register('email')} className="min-w-[380px] px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-400'" />
        {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
      </div>
     { isVeriified && (
        <>
      <div>
        <label className="block text-sm font-medium mb-1">New Password</label>
        <input type="password" {...register('newPassword')} className="min-w-[380px] px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-400'" />
        {errors.newPassword && <p className="text-xs text-red-600 mt-1">{errors.newPassword.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Confirm New Password</label>
        <input type="password" {...register('confirmNewPassword')} className="min-w-[380px] px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-400'" />
        {errors.confirmNewPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmNewPassword.message}</p>}
      </div> 
      </>
      )
      }
      
       <div className='flex justify-center'>
      <button disabled={isSubmitting} type="submit" className='min-w-[150px] mx-auto font-bold bg-indigo-400 text-black py-2 rounded-3xl hover:bg-indigo-600 disabled:opacity-60'>
        {token ? "Rest Password" : isSubmitting ? 'Sending Email..' : 'Send Reset Link'}
      </button>
      </div>
    </form>
          </div>
        </div>
    </>
  )
}
