import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './features/auth/pages/LoginPage';
import Register from '../src/features/auth/pages/RegisterPage';;
import AboutUs from './pages/AboutUs';
import PrivateRoute from './components/PrivateRoute';
import ProtectedRoute from './components/ProtectedRoutes';
import Questionire from './features/users/pages/Questionire';
import ProfilePage from './features/users/pages/ProfilePage';
import CourseListPage from './features/users/pages/CourseListPage';
import AdminDashBoard from './features/admin/pages/AdminDashBoard';
import AdminCourseListPage from './features/admin/pages/AdminCourseListPage';
import ManageUsers from './features/admin/pages/ManageUsers';
import MyCourses from './features/users/pages/MyCourses';
import RecommendationsPage from './features/roadmap/pages/RecommendationPage';
import RoadmapPage from './features/roadmap/pages/RoadmapPage';
import CourseProgress from './features/analytics/components/CourseProgress';
import SingleCoursePage from './features/users/pages/singleCoursePage';
import VerifyEmailPage from  './pages/VerifyEmailPage';
import HomePage from './features/users/pages/HomePage';
import PathsPage from './features/roadmap/pages/PathsPage';
import SinglePathPage from './features/roadmap/pages/SinglePathPage';
import ForgetPasswordPage from './features/auth/pages/ForgetPasswordPage';
import RoadmapsPages from './features/roadmap/pages/RoadmapsPages';
import Mainlayout from './components/Mainlayout';
import AdminAnalytics from './features/admin/pages/AnalyticsAdminPage';
import AdminMainLayout from './features/admin/pages/AdminMainLayout';
import QuizePage from './features/cerificate/pages/QuizePage';
export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Route */}
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path='/forgetPassword/:token' element={<ForgetPasswordPage/>}/>
        <Route path='/forgetPassword' element={<ForgetPasswordPage/>}/>
        <Route path='/aboutus' element={<AboutUs/>}/>
         <Route path='/verify-email/' element={<VerifyEmailPage/>}/>
        <Route path='/register/question' element={<ProtectedRoute requiredRole="learner"><Questionire/></ProtectedRoute>}/>
       {/* User Route */}
        <Route element = {<Mainlayout/>}>
        <Route path='/profile' element={<ProtectedRoute requiredRole="learner"><ProfilePage/></ProtectedRoute>}/>
        <Route path='/home' element={<ProtectedRoute requiredRole="learner"><HomePage/></ProtectedRoute>}/>
        <Route path='/paths' element={<ProtectedRoute requiredRole="learner"><PathsPage/></ProtectedRoute>}/>
        <Route path='/paths/:pathId' element={<ProtectedRoute requiredRole="learner"><SinglePathPage/></ProtectedRoute>}/>
        <Route path='/mycourses' element={<ProtectedRoute requiredRole="learner"><MyCourses/></ProtectedRoute>}/>
        <Route path='/courses' element={<ProtectedRoute requiredRole="learner"><CourseListPage/></ProtectedRoute>}/>
        <Route path='/courses/:courseId' element={<ProtectedRoute requiredRole="learner"><SingleCoursePage/></ProtectedRoute>}/>
        <Route path='/roadmapgeneration' element={<ProtectedRoute requiredRole="learner"><RoadmapsPages/></ProtectedRoute>}/>
        <Route path='/roadmapgeneration/:roadmapId' element={<ProtectedRoute requiredRole="learner"><RoadmapPage/></ProtectedRoute>}/>
        <Route path='/courseprogress' element={<ProtectedRoute requiredRole="learner"><CourseProgress/></ProtectedRoute>}/>
        <Route path='/recommendation' element={<ProtectedRoute requiredRole="learner"><RecommendationsPage/></ProtectedRoute>}/>
        <Route path='/courses/:courseId/quiz' element={<ProtectedRoute requiredRole="learner"><QuizePage/></ProtectedRoute>}/>
        </Route>
        {/* Admin Route */}
        <Route element = {<AdminMainLayout/>}>
        <Route path="/admin" element={<PrivateRoute requiredRole="admin"><AdminDashBoard/></PrivateRoute>} />
        <Route path="/admin/courses" element={<PrivateRoute requiredRole="admin"><AdminCourseListPage/></PrivateRoute>}/>
        <Route path="/admin/users" element={<PrivateRoute requiredRole="admin"><ManageUsers/></PrivateRoute>}/>
        <Route path="/admin/analytics" element={<PrivateRoute requiredRole="admin"><AdminAnalytics/></PrivateRoute>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
