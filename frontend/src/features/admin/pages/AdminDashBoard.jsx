import { Link ,useNavigate} from "react-router-dom";
import { logout } from "../../../utils/authhelper";
export default function AdminDashBoard() {
  const nav = useNavigate();
   const onLoggedout = () => {
      logout();
      nav("/");
    };
    return(
  <>
        <div className="flex justify-center items-center min-h-screen">
        <div className="flex gap-6">
        <Link
          to="/admin/courses"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition font-bold"
        >
          Manage Courses
        </Link>
        <Link
          to="/admin/users"
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition font-bold"
        >
          Manage Users
        </Link>
          <Link
          to="/admin/analytics"
          className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-green-700 transition font-bold"
        >
          View Analytics
        </Link>
        <button onClick={onLoggedout} className="bg-yellow-300">Logout</button>
      </div>
        </div>
        </>
    )
}

