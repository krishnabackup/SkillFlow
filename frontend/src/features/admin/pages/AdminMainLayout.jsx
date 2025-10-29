import logo from "../../../assets/logo.png"
import { isAuthenticated, logout } from "../../../utils/authhelper"
import { Link, useNavigate ,useLocation } from "react-router-dom"
import { Outlet } from "react-router-dom";

const links = [
    {
        label : "Home" , link : "/admin"
    },
    {
        label : "ManageUsers" , link : "/admin/users"
    },
    {
        label : "ManageCourses"  , link  : "/admin/courses"
    },
    {
        label : "ViewAnalytics" ,link : "/admin/analytics"
    }
]
export default function AdminMainLayout() {
    const nav = useNavigate();
    const location = useLocation();
    const onLoggedout = () => {
    logout()
    nav("/")
} 
    return(
        <>
         <nav className="bg-[#ced725] px-4 py-3 flex items-center justify-between shadow">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2 gap-x-10">
          <img
            className="mx-auto block h-20 rounded-full sm:mx-0 sm:shrink-0"
            src={logo}
            alt="Logo"
          />
        </div>
        <div className="flex gap-3 font-extrabold">
            {
                links.map(link => {
                    const isActivated = location.pathname === link.link;
                    return (
                    <Link
                    key={link.link}
                    to={link.link}
                    className={`text-black hover:bg-indigo-300 px-3 py-1 rounded transition ${
                        isActivated ? "text-indigo-700 underline underline-offset-4" : "text-black hover:bg-indigo-300"
                    }`}
                    >{link.label}</Link>
                )
                    }
                )
            }
        </div>
      </div>

      <div className="flex items-center space-x-4 justify-end ml-auto">
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
    <div>
        <Outlet></Outlet>
    </div>
        </>
    )
}