import { Link ,useNavigate} from "react-router-dom";
export default function AdminDashBoard() {
    return(
  <>
        <div className="flex justify-center items-center mt-80">
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
          className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition font-bold"
        >
          View Analytics
        </Link>
      </div>
        </div>
        </>
    )
}

