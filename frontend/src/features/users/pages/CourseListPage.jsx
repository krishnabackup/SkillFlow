// src/pages/CourseListPage.jsx
import React, { useState } from "react";
import useCourses from "../../../hooks/useCousrse";
import useDebounce from "../../../hooks/useDebounce";
import CourseCard from "../../../components/CourseCard";
import Pagination from "../../../components/Pagination";
import { useEnrollCourse } from "../../../hooks/useEnrollments";
import { addUserEnrolledCourses } from "../../../services/user_course_services";
export default function CourseListPage() {
  // local UI state
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [skill, setSkill] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const debouncedQuery = useDebounce(query);
  const deboundedSkill = useDebounce(skill)
  

  // fetch
  const { data,isLoading, isError,isFetching,error} = useCourses({
    page,
    query: debouncedQuery,
    skill : deboundedSkill,
    difficulty
  });
  
  const addmutate = useEnrollCourse();

  // reset page when filters change
  React.useEffect(() => setPage(1), [debouncedQuery, skill, difficulty]);

  
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  // Safe optional chaining in case backend changes shape
  const courses = data?.items || [];
  const handleAddCourses =  async (courseId) => {
    try {
    const res = await addmutate.mutateAsync(courseId);
    alert("Course added Sucessfully");
    }
    catch(error) {
      if(error.response){
        const status = error.response.status;
        if(status === 402) alert("Course already existed");
      }
      else{
        console.log(error.message);
      }
    }
  }
  return (
  <>    
    <main className="max-w-6xl mx-auto p-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Courses</h1>

        <div className="flex gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses..."
            className="px-3 py-2 rounded bg-white/5 text-white placeholder-gray-400"
            aria-label="Search courses"
          />

          <select value={difficulty} 
          onChange={(e)=> setDifficulty(e.target.value)} 
            className="px-3 py-2 rounded bg-white/5 text-white">
            <option  className="text-black bg-gray-400"
            value="">All difficulty</option>
            <option value="beginner" className="text-black bg-gray-400">Beginner</option>
            <option value="intermediate" className="text-black bg-gray-400">Intermediate</option>
            <option value="advanced" className="text-black bg-gray-400">Advanced</option>
          </select>

          <input
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="Filter by skill (comma separated)"
            className="px-3 py-2 rounded bg-white/5 text-white"
          />
        </div>
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
        {courses.map(course => <CourseCard key={course._id || course.id} course={course} onAdd={handleAddCourses}/>)}
      </section>

      <Pagination page={data.page} total={data.total} limit={data.limit} onPage={(p) => setPage(p)} />
    <div>
        {
            isFetching && <p className="text-sm text-gray-400">Refreshing</p>
        }
    </div>
    </main>
    </>
  );
}
