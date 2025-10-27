
// src/components/Navbar.jsx

import logo from "../assets/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import {isAuthenticated, logout } from '../utils/authhelper';

const links = [
  {
    label : "HOME", link : "/home"
  },
  {
    label : "COURSE" , link : "/courses"
  },
  {
    label : "RECOMMENDATION" , link : "/recommendation"
  },
  {
    label : "MY COURSE" , link : "/mycourses"
  },
  {
    label : "ROADMAP" , link : "/roadmapgeneration"
  },
  {
    label : "MY PATHS" , link : "/paths"
  }
]
export default function Navbar() {
  const nav = useNavigate();
  const onLoggedout = () => {
    logout();
    nav('/');
  };
  return (
    <nav className="bg-[#ced725] px-4 py-3 flex items-center justify-between shadow">
      
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2 gap-x-10">
          <img className="mx-auto block h-20 rounded-full sm:mx-0 sm:shrink-0" src={logo} alt="LogoImage" />
        </div>
        <div className="flex space-x-6">
          {links.map((value,index)=> (
               <a
               key={index}
              className="text-black hover:text-indigo-300 px-3 py-1 rounded transition font-extrabold"
              href={value.link}
            >
              {value.label}
            </a>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-4 justify-end ml-auto">
        <a className="text-black hover:text-indigo-300 px-3 py-1 rounded transition font-extrabold" href="/aboutus">
          About US 
        </a>
        {isAuthenticated() && (
          <button onClick={onLoggedout} className="bg-red-500 text-white px-4 py-2 rounded font-bold">
            LOGOUT
          </button>
        )}
      </div>
    </nav>
  );
}
