import { Outlet } from "react-router-dom"
import Navbar from "./NavBar"
export default function Mainlayout() {
  return (
    <>
    <Navbar/>
    <div className="main-content">
        <Outlet/>
    </div>
    </>
  )
}
