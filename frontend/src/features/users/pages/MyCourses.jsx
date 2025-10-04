// LearnerDashboard.jsx
import React from 'react';
import { useEnrollCourse, useUnEnroll, useEnrollments } from '../../../hooks/useEnrollments';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/NavBar';
const links = [
        {
        label : "Home", link : '/home'
    },
    {
      label : "Courses",link : "/courses" 
    },
    {
        label : "Recommandation" , link : "/recommandation"
    },
    {
        label : "Generate Roadmap" , link : "/roadmapgeneration"
    },
    {
        label: "My Profile", link : "/profile"
    },
]

export default function MyCourses() {
  const { data: enrollments, isLoading, isError, isFetching } = useEnrollments();
  const unenrollMut = useUnEnroll();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading enrollments.</div>;

  if (!enrollments || enrollments.length === 0) {
    return <div className="p-6 text-center">You have no enrolled courses. <Link className="text-blue-500" to="/courses">Browse courses</Link></div>
  }

  return (
    <>
    <Navbar links={links}></Navbar>
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-white">My Courses {isFetching && <span className="text-sm text-gray-400">refreshing…</span>}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {enrollments.map(e => {
          const c = e.course;
          return (
            <div key={c._id} className="bg-white p-4 rounded shadow">
              <img src={c.thumbnail} alt={`${c.title} thumbnail`} className="w-full h-36 object-cover rounded"/>
              <h2 className="mt-2 font-semibold">{c.title}</h2>
              <p className="text-sm text-gray-600">{c.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Progress</div>
                  <div className="text-sm font-bold">{e.progress ?? 0}%</div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/courses/${c._id}`} className="px-3 py-1 bg-indigo-600 text-white rounded">Continue</Link>
                  <button
                    onClick={() => unenrollMut.mutate(c._id)}
                    aria-label={`Unenroll from ${c.title}`}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >Unenroll</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}
