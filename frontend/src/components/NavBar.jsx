
// src/components/Navbar.jsx

import { BellIcon } from '@heroicons/react/outline';
import logo from "../assets/logo.png";

export default function Navbar(props) {
  return (
    <nav className="bg-[#ced725] px-4 py-3 flex items-center justify-between shadow">
      <div className="flex items-center space-x-8">
        {/* Logo */}
        <div className="flex items-center space-x-2 gap-x-10">
          {/* Replace with your SVG logo */}
            <img className="mx-auto block h-20 rounded-full sm:mx-0 sm:shrink-0" src={logo} alt="LogoImage" />
        </div>
        {/* Navigation Links */}
        <div className="flex space-x-6">
        
            <a className="text-black hover:text-indigo-300 px-3 py-1 rounded transition font-extrabold" href={props.labels == "Register" ? "/register" : "/"}>
            {props.labels}
          </a>    
          <a className="text-black hover:text-indigo-300 px-3 py-1 rounded transition font-extrabold" href="/aboutus">
            About US 
          </a>  
       </div>
      </div>
      <div className="flex items-center space-x-4">
        {/* Profile Avatar */}
        {
          props.image && <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          className="h-8 w-8 rounded-full"
          alt="Profile"
        />
        }
      </div>
    </nav>
  );
}
