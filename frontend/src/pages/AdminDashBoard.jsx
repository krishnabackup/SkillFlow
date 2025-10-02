import Navbar from "../components/NavBar";
import { Link } from "react-router-dom";
const links = [   
{
    label : "Admin Dashboard", link : "/admin" 
},
]
export default function AdminDashBoard() {
    return(
        <>
        <Navbar links={links}/>
        <div className="flex justify-center items-center min-h-screen">
        <div className="flex gap-6">
        <Link
          to="/admin/courses"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Manage Courses
        </Link>
        <Link
          to="/admin/users"
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
        >
          Manage Users
        </Link>
      </div>
        </div>
        </>
    )
}

