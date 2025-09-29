import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Dashboard from './pages/DashBoard';
import NavBar from './components/NavBar';
import AboutUs from './pages/AboutUs';
import PrivateRoute from './PrivateRoute';
import Questionire from './pages/Questionire';
import ProfilePage from './pages/ProfilePage';
import UserDashBoard from './pages/UserDashboard';

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path='/aboutus' element={<AboutUs/>}/>
        <Route path='/register/question' element={<Questionire/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
        <Route path='userdashboard' element={<UserDashBoard/>}/>
        <Route path="/admin" element={<PrivateRoute requiredRole="admin"><Dashboard/></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
