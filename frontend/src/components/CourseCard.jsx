import React from "react";
import { getUserRole } from "../utils/authhelper";
export default function CourseCard({course,onOpenModel}){
   const role = getUserRole();
    return(
    <>
     <article className="bg-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold mb-1 text-white">{course.title}</h3>
      <p className="text-sm text-gray-300 mb-2 line-clamp-3">{course.description || "No description"}</p>
        <div className="flex gap-2 items-center">
          <span className="px-2 py-0.5 rounded text-xs bg-indigo-600/20 text-gray-300">{course.difficulty}</span>
        </div>
        <div className="flex gap-2 items-center text-gray-300 mt-2">
            <p className="text-sm">Skills Learned :</p>
            {course.skills?.slice(0,3).map((s, i) => (
            <span key={i} className="text-xs bg-white/5 px-2 py-0.5 rounded">{s}</span>
          ))}
        </div>
        {
          role === "admin" ? (<div className="text-base flex justify-between mt-2">
          <button className="bg-blue-400 text-black rounded-full p-1 min-w-12 font-bold" onClick={onOpenModel}>EDIT</button>
          <button className="bg-red-600 text-black rounded-full p-1 font-bold">DELETE</button>
        </div>) : (<></>)
        }
        
    </article>
    </>)
}