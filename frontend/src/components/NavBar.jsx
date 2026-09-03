import { Link, useNavigate ,useLocation } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/authhelper";
import logo from "../assets/logo.png"
import {Menu,X} from 'lucide-react'
import { useState } from "react";
const links = [
  { label: "HOME", link: "/home" },
  { label: "COURSE", link: "/courses" },
  { label: "RECOMMENDATION", link: "/recommendation" },
  { label: "MY COURSE", link: "/mycourses" },
  { label: "ROADMAP", link: "/roadmapgeneration" },
  { label: "MY PATHS", link: "/paths" },
  {label : "CERTIFICATE" , link : "/certificates"},
  { label: "MY PROFILE", link: "/profile" },
  {label : "About Us" , link : "/aboutus"}
];

export default function Navbar() {
  const location = useLocation();
  const nav = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const onLoggedout = () => {
    logout();
    nav("/");
  };

  return (
    <>
    <nav className="relative bg-[#ced725] px-4 py-3">
              <div className="flex items-center justify-between w-full">
          <div>
          <img
            className="h-20 rounded-full"
            src={logo}
            alt="Logo"
          />
        </div>

        <div className="hidden xl:flex ">
          {links.map((value, index) => {
            const isActive = location.pathname == value.link;
            return (
            <Link
              key={index}
              to={value.link}
              className= {`text-black hover:text-indigo-300 px-3 py-1 rounded transition font-extrabold ${
                  isActive
                    ? "text-indigo-700 underline underline-offset-4"
                    : "text-black hover:text-indigo-300"
                }`}
            >
              {value.label}
          </Link>
          )
          }
        )
          }
        
        {isAuthenticated() && (
          <button
            onClick={onLoggedout}
            className="bg-red-500 text-white px-4 py-2 rounded font-bold"
          >
            LOGOUT
          </button>
        )}
        </div>

        <button className = "xl:hidden text-black hover:text-indigo-300 px-3 py-1 rounded transition font-extrabold"
         onClick={() => setIsOpen(!isOpen)}
         >
          <Menu size={24} />
         </button>
         </div>
          {isOpen && <MobileMenu />}
    </nav>    
      </>
    );
}

const MobileMenu = () => {
  return (
      <div className="absolute top-full right-0  p-2 bg-black/70 z-50 backdrop-blur-sm ">
          <div className="flex flex-col">
          {links.map((value, index) => {
            const isActive = location.pathname == value.link;
            return (
            <Link
              key={index}
              to={value.link}
              className= {`text-white hover:text-indigo-300 px-3 py-1 rounded transition font-extrabold ${
                  isActive
                    ? "text-indigo-700 underline underline-offset-4"
                    : "text-white hover:text-indigo-300"
                }`}
            >
              {value.label}
          </Link>
          )
          }
        )
          }
        </div>
        </div>
  );
};
