import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { loginUser } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { getUserRole, setToken } from '../../../utils/authhelper';
import { Navigate } from 'react-router-dom';
import { isAuthenticated} from '../../../utils/authhelper';
const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup.string().min(6,'At least 6 characters').required('Password required')
});

export default function LoginForm(){
  const { register, handleSubmit, formState:{errors, isSubmitting} } = useForm({ resolver: yupResolver(schema) });
  const [serverError, setServerError] = useState('');
  const nav = useNavigate();
    if(isAuthenticated()){
    const user = getUserRole();
    if(user === "admin") return <Navigate to="/admin" replace/>
    else if(user=== "learner") return <Navigate to="/userdashboard" replace/>
  }
  const onSubmit = async (data) => {
    setServerError('');
    try {
      const res = await loginUser(data)
      setToken(res.data.token);
      const role = getUserRole();
      if(role == "admin") {
         nav('/admin');
      }
      else {
        nav('/home');
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
          <input type="checkbox" className="mr-2" />
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
