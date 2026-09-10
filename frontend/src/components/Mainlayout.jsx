import { Outlet } from "react-router-dom"
import Navbar from "./NavBar"
import {Toaster}  from "sonner"
export default function Mainlayout() {
  return (
    <>
    <Navbar/>
    <div className="main-content">
      <Toaster position="top-center"
      toastOptions={{
    classNames: {
      toast: "!rounded-xl !shadow-lg",

      success:
        "!bg-white !text-green-700 !border-green-200",

      error:
        "!bg-white !text-red-700 !border-red-200",

      info:
        "!bg-white !text-blue-700 !border-blue-200",

      warning:
        "!bg-white !text-yellow-700 !border-yellow-200",

      title: "!font-semibold",
      description: "!text-gray-500",
    },
  }}
      />
        <Outlet/>
    </div>
    </>
  )
}
