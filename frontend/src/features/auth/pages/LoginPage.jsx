import React from 'react';
import LoginForm from '../components/LoginForm';

 

export default function LoginPage(){
    return (
       <>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-indigo-950 to-neutral-900">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 border border-white/30 shadow-xl backdrop-blur-xl
                      bg-clip-padding text-white
                      dark:bg-black/40 dark:border-white/20 transition">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-200 drop-shadow">
          Sign In To Continue
        </h1>
        <LoginForm />
        <p className="text-center text-sm text-gray-200 mt-4">
          Don&apos;t have an account?
          <a href="/register" className="text-indigo-300 hover:underline ml-1">
            Register
          </a>
        </p>
      </div>
    </div>
    </>
  );
}
