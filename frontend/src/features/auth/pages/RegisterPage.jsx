import React from 'react';
import RegisterForm from '../components/RegisterForm';
import NavBar from '../../../components/NavBar';
const links = [
  {
    label : "Login", link : "/login"
  }
]
export default function RegisterPage(){
  return (
       <>
      <NavBar links={links} />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-indigo-950 to-neutral-900">
      <div className="max-w-md p-8 rounded-2xl bg-white/10 border border-white/30 shadow-xl backdrop-blur-xl
                      bg-clip-padding text-white
                      dark:bg-black/40 dark:border-white/20 transition">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-200 drop-shadow">
          Create an Account 
        </h1>
        <RegisterForm />
        <p className="text-center text-sm text-gray-200 mt-4">
          Already have an account?
          <a href="/" className="text-indigo-300 hover:underline ml-1">
            Login
          </a>
        </p>
      </div>
    </div>
    </>
  );
}