import logo from "../assets/logo.png";
import { Link, useNavigate ,useLocation } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/authhelper";

const links = [
  { label: "HOME", link: "/home" },
  { label: "COURSE", link: "/courses" },
  { label: "RECOMMENDATION", link: "/recommendation" },
  { label: "MY COURSE", link: "/mycourses" },
  { label: "ROADMAP", link: "/roadmapgeneration" },
  { label: "MY PATHS", link: "/paths" },
  { label: "MY PROFILE", link: "/profile" },
];

export default function Navbar() {
  const location = useLocation();
  const nav = useNavigate();

  const onLoggedout = () => {
    logout();
    nav("/");
  };

  return (
    <nav className="bg-[#ced725] px-4 py-3 flex items-center justify-between shadow">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2 gap-x-10">
          <img
            className="mx-auto block h-20 rounded-full sm:mx-0 sm:shrink-0"
            src={logo}
            alt="Logo"
          />
        </div>

        <div className="flex space-x-6">
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
        </div>
      </div>

      <div className="flex items-center space-x-4 justify-end ml-auto">
        <Link
          to="/aboutus"
          className="text-black hover:text-indigo-300 px-3 py-1 rounded transition font-extrabold"
        >
          About Us
        </Link>

        {isAuthenticated() && (
          <button
            onClick={onLoggedout}
            className="bg-red-500 text-white px-4 py-2 rounded font-bold"
          >
            LOGOUT
          </button>
        )}
      </div>
    </nav>
  );
}
