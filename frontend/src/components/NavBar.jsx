
// src/components/Navbar.jsx

import logo from "../assets/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import { getUserRole, isAuthenticated, logout } from '../utils/authhelper';

export default function Navbar(props) {
  const role = getUserRole();
  const nav = useNavigate();
  const onLoggedout = () => {
    logout();
    nav('/');
  };
  return (
    <nav className="bg-[#ced725] px-4 py-3 flex items-center justify-between shadow">
      {/* Left Side: Logo and optional navigation link */}
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2 gap-x-10">
          <img className="mx-auto block h-20 rounded-full sm:mx-0 sm:shrink-0" src={logo} alt="LogoImage" />
        </div>
        <div className="flex space-x-6">
          {props.labels && (
            <a
              className="text-black hover:text-indigo-300 px-3 py-1 rounded transition font-extrabold"
              href={props.labels === "Register" ? "/register" : "/"}
            >
              {props.labels}
            </a>
          )}
        </div>
      </div>
      
      {/* Right Side: About US and LOGOUT button */}
      <div className="flex items-center space-x-4 justify-end ml-auto">
        <a className="text-black hover:text-indigo-300 px-3 py-1 rounded transition font-extrabold" href="/aboutus">
          About US 
        </a>
        {isAuthenticated() && (
          <button onClick={onLoggedout} className="bg-red-500 text-white px-4 py-2 rounded font-bold">
            LOGOUT
          </button>
        )}
        {props.image && (
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            className="h-8 w-8 rounded-full"
            alt="Profile"
          />
        )}
      </div>
    </nav>
  );
}
