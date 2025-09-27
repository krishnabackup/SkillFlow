import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
    name : yup.string().min(2,"At least two character").required('Name required'),
    email : yup.string().email('Invalid email').required('Email Required').matches(/^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9.]+@gmail\.com$/,'Only letters, numbers and single dots allowed; no consecutive, starting or trailing dots'),
    password : yup.string().min(8,"Atleat 8 charcter").required("Password required").matches(/(.*[a-z].*){1,}/, 'Password must contain at least one lowercase letters')
  .matches(/(.*[A-Z].*){1,}/, 'Password must contain at least one uppercase letters')
  .matches(/(.*\d.*){2,}/, 'Password must contain at least two numbers'),
    confirm : yup.string().oneOf([yup.ref('password')],"Password must match").required('Confirm Required')
});

export default function RegisterForm() {
    const {register,handleSubmit,formState:{errors,isSubmitting}} = useForm({resolver : yupResolver(schema)})
    const [serverError,setServerError] = useState('');
    const nav = useNavigate();
    const onSubmit = async (data) => {
        setServerError('');
        const payload = {name : data.name , email : data.email , password : data.password};
        try {
            const res = await api.post('/auth/register',payload);
            localStorage.setItem('token',res.data.token);
            nav('/register/question');
        }
        catch(error) {
           setServerError(error?.response?.data?.message || "Registration Faiiled");
        }
    };
    return(
        <>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {serverError && <div className='text-red-600 text-sm'>{serverError}</div>}
            <div>
                <label className=' block text-sm mb-1'>Name</label>
                <input {...register('name')} className='min-w-[350px] px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-400' />
                {errors.name && <p className='text-xs text-red-600 mt-1'>{errors.name.message}</p>}
            </div>
             <div>
                <label className='block text-sm mb-1'>Email</label>
                <input {...register('email')} className='min-w-[350px] px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-400' />
                {errors.email && <p className='text-xs text-red-600 mt-1'>{errors.email.message}</p>}
            </div>
             <div>
                <label className='block text-sm mb-1'>Password</label>
                <input type="password" {...register('password')} className='min-w-[350px] px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-400' />
                {errors.password && <p className='text-xs text-red-600 mt-1'>{errors.password.message}</p>}
            </div>
             <div>
                <label className='block text-sm mb-1'>Confirm Password</label>
                <input type='password' {...register('confirm')} className='min-w-[350px] px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-400' />
                {errors.confirm && <p className='text-xs text-red-600 mt-1'>{errors.confirm.message}</p>}
            </div>
            <div className='flex justify-center'>
            <button disabled={isSubmitting} type='submit' className='min-w-[200px] mx-auto font-bold bg-indigo-400 text-black py-2 rounded-3xl hover:bg-indigo-600 disabled:opacity-60'>{isSubmitting ? 'Creating...' : 'Register'}</button>
       </div>
        </form>
        </>
    )
}