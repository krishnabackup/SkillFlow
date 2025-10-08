import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './features/auth/pages/LoginPage';
import Register from '../src/features/auth/pages/RegisterPage';;
import AboutUs from './pages/AboutUs';
import PrivateRoute from './PrivateRoute';
import Questionire from './features/users/pages/Questionire';
import ProfilePage from './features/users/pages/ProfilePage';
import UserDashBoard from './features/users/pages/UserDashboard';
import CourseListPage from './features/users/pages/CourseListPage';
import AdminDashBoard from './pages/AdminDashBoard';
import AdminCourseListPage from './features/admin/pages/AdminCourseListPage';
import ManageUsers from './features/admin/pages/ManageUsers';
import MyCourses from './features/users/pages/MyCourses';
import RecommendationsPage from './features/users/pages/RecommendationPage';

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
        <Route path='/recommandation'  element={<RecommendationsPage/>}/>
        <Route path="/admin" element={<PrivateRoute requiredRole="admin"><AdminDashBoard/></PrivateRoute>} />
       <Route path="/admin/courses" element={<PrivateRoute requiredRole="admin"><AdminCourseListPage/></PrivateRoute>}/>
       <Route path="/admin/users" element={<PrivateRoute requiredRole="admin"><ManageUsers/></PrivateRoute>}/>
      </Routes>
    </BrowserRouter>
  )
}
