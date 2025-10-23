import React, {useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { loginUser } from '../../../services/api';
import { getUserRole, setToken } from '../../../utils/authhelper';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated} from '../../../utils/authhelper';
const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup.string().min(6,'At least 6 characters').required('Password required'),
  rememberMe : yup.boolean()
});

export default function LoginForm(){
  const navigate = useNavigate();
  const [isChecked,setIsChecked] = useState(false);
  const { register, handleSubmit, formState:{errors, isSubmitting} } = useForm({ resolver: yupResolver(schema) });
  const [serverError, setServerError] = useState('');
   useEffect(() => {
      if(isAuthenticated()){
    const user = getUserRole();
    if(user === "admin") navigate("/admin",{replace : true})
    else if(user=== "learner") navigate("/home",{replace : true})
  }
   },[navigate])
    
  const onSubmit = async (data) => {
    setServerError('');
    try {
      const res = await loginUser(data)
      if(res.status === 201) {
        const token = res.data.token;
        const role = res.data.user.role;
        if(data.rememberMe) {
          setToken(token);
        }
        else{
          sessionStorage.setItem('token',token)
          console.log(role)
          if(role === "admin") navigate("/admin",{replace : true})
          else navigate("/home",{replace : true})
        }
 
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed';
      setServerError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && <div className="text-red-600 text-sm">{serverError}</div>}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input {...register('email')} className="min-w-[380px] px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-400'" />
        {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input type="password" {...register('password')} className="min-w-[380px] px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-400'" />
        {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center text-sm">
          <input type="checkbox" {...register("rememberMe")}className="mr-2" />
          Remember me
        </label>
        <a href="/forgetPassword" className="text-sm text-indigo-600">Forgot?</a>
      </div>
       <div className='flex justify-center'>
      <button disabled={isSubmitting} type="submit" className='min-w-[150px] mx-auto font-bold bg-indigo-400 text-black py-2 rounded-3xl hover:bg-indigo-600 disabled:opacity-60'>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>
      </div>
    </form>
  )
}
