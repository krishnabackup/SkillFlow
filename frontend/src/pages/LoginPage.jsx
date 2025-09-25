import React from 'react';
import LoginForm from '../features/auth/components/LoginForm';
import NavBar from '../components/NavBar';

export default function LoginPage(){
  return (
       <>
       <NavBar></NavBar>
        <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-semibold text-center mb-4 text-red-500">SkillForge</h1>
        <p className="text-sm text-center mb-6">Sign in to continue</p>
        <LoginForm />
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account? <a href="/register" className="text-indigo-600">Register</a>
        </p>
      </div>
    </div>
    </>
  );
}
