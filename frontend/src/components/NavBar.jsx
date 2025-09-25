
// src/components/Navbar.jsx

import { BellIcon } from '@heroicons/react/outline';
import logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <nav className="bg-[#ced725] px-4 py-3 flex items-center justify-between shadow">
      <div className="flex items-center space-x-8">
        {/* Logo */}
        <div className="flex items-center space-x-2 gap-x-10">
          {/* Replace with your SVG logo */}
            <img class="mx-auto block h-24 rounded-full sm:mx-0 sm:shrink-0" src={logo} alt="LogoImage" />
        </div>
        {/* Navigation Links */}
        <div className="flex space-x-6">
          <a className="text-black font-medium hover:text-indigo-300 px-3 py-1 rounded transition" href="#">
            Dashboard
          </a>
          <a className="text-black hover:text-indigo-300 px-3 py-1 rounded transition" href="#">
            Team
          </a>
          <a className="text-black hover:text-indigo-300 px-3 py-1 rounded transition" href="#">
            Projects
          </a>
          <a className="text-black hover:text-indigo-300 px-3 py-1 rounded transition" href="#">
            Calendar
          </a>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {/* "New Job" Button */}
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-2 rounded shadow transition">
          + New Job
        </button>
        {/* Notification Icon */}
        <button className="relative">
          <BellIcon className="h-6 w-6 text-gray-200" />
        </button>
        {/* Profile Avatar */}
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          className="h-8 w-8 rounded-full"
          alt="Profile"
        />
      </div>
    </nav>
  );
}
