// src/pages/AdminCourses.jsx
import React, { useState } from 'react';
import { useCourses, useDeleteCourses } from '../../../hooks/useAdminCourses';
import CreateEditCourseModal from "../componenets/CreateEditCourseModal";
import CourseCard from '../../../components/CourseCard';
import Pagination from '../../../components/Pagination';

 
export default function AdminCourses(){
  const [page,setPage] = useState(1);
  const [query,setQuery] = useState('');
  const [isModelOpen,setModelOpen] = useState(false);
  const [modelData,setModelData] = useState(null);

  const { data, isLoading, isError ,isFetching} = useCourses({ 
    page,
    query : query
  });
  const deleteMut = useDeleteCourses();
  const [editCourse,setEditCourse] = useState(null);
  const openModel  = (data) => {
    setModelData(data);
    setModelOpen(true);
    setEditCourse(null);
  };
  
  const closeModel = () => {
    setModelOpen(false);
  }
   
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading courses.</div>;
  const courses = data?.items || [];
  const handleEdit = (courseData) => {
    setEditCourse(courseData);
    setModelOpen(true);
  }
  const handleDelete = (course_id) => {
    deleteMut.mutateAsync(course_id)
  }
  return (
    <>
      <main className="max-w-6xl mx-auto p-6">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-white">Manage Courses</h1>
    
            <div className="flex gap-3">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses..."
                className="px-3 py-2 rounded bg-white/5 text-white placeholder-gray-400"
                aria-label="Search courses"
              />
            </div>
            <button className='bg-green-400 text-black rounded-full p-1 font-bold' onClick={openModel}>Add Course</button>
          </header>
    
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <div key={i} className="h-28 bg-gray-800 animate-pulse rounded" />)}
            </div>
          )}
    
          {isError && <div className="text-red-400">{isError}</div>}
    
          {!isLoading && courses.length === 0 && (
            <div className="text-gray-300">No courses found. Try different search or filters.</div>
          )}
    
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => <CourseCard key={course._id || course.id} course={course} onEdit={handleEdit} onDelete={handleDelete}/>)}
          </section>
    
          <Pagination page={data.page} total={data.total} limit={data.limit} onPage={(p) => setPage(p)} />
        <div>
            {
                isFetching && <p className="text-sm text-gray-400">Refreshing</p>
            }
        </div>
        {
            isModelOpen && <CreateEditCourseModal course={editCourse} onClose={closeModel} modelData={modelData} /> 
        }     
        </main>
    </>
  );
}
