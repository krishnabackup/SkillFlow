import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Dashboard from './pages/DashBoard';
import NavBar from './components/NavBar';
import AboutUs from './pages/AboutUs';

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path='/aboutus' element={<AboutUs/>}/>
      </Routes>
    </BrowserRouter>
  )
}
