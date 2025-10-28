
import React from 'react'
import Navbar from '../../../components/NavBar'
import { useDeleteRoadmap, useRoadmap } from '../../../hooks/useRoadmap';
import { useNavigate ,Link } from 'react-router-dom';
export default function RoadmapsPages() {
  const nav = useNavigate();
  const {data : roadmaps, isFetching,isLoading,isError} = useRoadmap();
  const deleteRoadmap = useDeleteRoadmap();
  const roadmapArray = roadmaps?.roadmap;
  if(isLoading) return <div className='text-white text-4xl'>Loading....</div>
  if(isError)  return <div className='text-red text-4xl'>Erorr Fetching.....</div>

    if (!roadmapArray || roadmapArray.length === 0) {
      return (
        <>
        <Navbar></Navbar>
        <div className="p-6 text-center text-white">You have no Paths to show. <Link className="text-blue-500" to="/home"> Generate a road map.</Link></div>
        </>
      )
    }

  const removeRoadmap = (roadmapId) => {
    deleteRoadmap.mutateAsync(roadmapId)
  }
  return(
    <>
    <Navbar></Navbar>
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-white"> MY ROADMAPS{isFetching && <span className="text-sm text-gray-400">refreshing…</span>}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {
          roadmapArray.map( roadmap => (
            <div key={roadmap._id} className='bg-gray-400 rounded-md shadow p-2 flex flex-col justify-between min-h-[120px]'>
               <h1 className='font-bold p-2'>{roadmap.title}</h1>
               <div className='p-2 flex justify-between'>
                <p>Duration : {roadmap.totalduration} Weeks </p>
                <p>Number of stages : {roadmap.stages.length}</p>
               </div>
               <div className='p-2 flex justify-between'>
                  <Link to={`/roadmapgeneration/${roadmap._id}`} className='p-2 bg-blue-400 font-bold rounded-full shadow' >View</Link>
                  <button className='rounded-full p-2 bg-red-500 text-black font-bold shadow' onClick={() => removeRoadmap(roadmap._id)}>Remove</button>
               </div>
            </div>
          ))
        }
      </div>
    </div>
    </>
  )
}