import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';;
import AboutUs from './pages/AboutUs';
import PrivateRoute from './PrivateRoute';
import Questionire from './pages/Questionire';
import ProfilePage from './pages/ProfilePage';
import UserDashBoard from './pages/UserDashboard';
import CourseListPage from './features/users/pages/CourseListPage';
import AdminDashBoard from './pages/AdminDashBoard';
import AdminCourseListPage from './features/admin/pages/AdminCourseListPage';
import ManageUsers from './features/admin/pages/ManageUsers';
import MyCourses from './features/users/pages/MyCourses';

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path='/aboutus' element={<AboutUs/>}/>
        <Route path='/register/question' element={<Questionire/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
        <Route path='/userdashboard' element={<UserDashBoard/>}/>
        <Route path='/mycourses' element={<MyCourses/>}/>
        <Route path='/courses' element={<CourseListPage/>}/>
        <Route path="/admin" element={<PrivateRoute requiredRole="admin"><AdminDashBoard/></PrivateRoute>} />
       <Route path="/admin/courses" element={<PrivateRoute requiredRole="admin"><AdminCourseListPage/></PrivateRoute>}/>
       <Route path="/admin/users" element={<PrivateRoute requiredRole="admin"><ManageUsers/></PrivateRoute>}/>
      </Routes>
    </BrowserRouter>
  )
}
