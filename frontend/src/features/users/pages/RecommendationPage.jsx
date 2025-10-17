import { useState } from "react";
import { useRecommendation } from "../../../hooks/useRecommedation";
import CourseCard from "../../../components/CourseCard";
import Navbar from "../../../components/NavBar";
import Pagination from "../../../components/Pagination";
import { useEnrollCourse } from "../../../hooks/useEnrollments";
export default function RecommendationsPage() {
  const [page,setPage] = useState(1)
  const { data, isLoading, isError } = useRecommendation({page});
  const addmutate = useEnrollCourse(); 
  const [activeTab, setActiveTab] = useState("fillGaps");

  if (isLoading) return <p className="text-white p-6">Loading recommendations...</p>;
  if (isError) return <p className="text-red-400 p-6">Error loading recommendations</p>;
  if(!data) {
    return (
        <>
        <Navbar links={[
          { label: "Home", link: "/home" },
          { label: "My Courses", link: "/mycourses" },
          { label: "Recommendation", link: "/recommendations" },
        ]}></Navbar>
        <p className="text-white p-6">No recommendations..</p>;
        </>
    )
  }
  const recommendations = data?.[activeTab] || [];
  console.log(recommendations)
  const handleAddCourses =  async (courseId) => {
    try {
     await addmutate.mutateAsync(courseId);
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
  console.log(data.totalResults)
  return (
    <>
      <Navbar
        links={[
          { label: "Home", link: "/home" },
          { label: "My Courses", link: "/mycourses" },
          { label: "Recommendation", link: "/recommendations" },
        ]}
      />

      <main className="max-w-6xl mx-auto p-6 text-white">
        <h1 className="text-3xl font-bold mb-6">Recommended Courses</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("fillGaps")}
            className={`px-4 py-2 rounded-xl ${
              activeTab === "fillGaps" ? "bg-indigo-600" : "bg-gray-700"
            }`}
          >
            Grow New Skills 🔧
          </button>
          <button
            onClick={() => setActiveTab("reinforce")}
            className={`px-4 py-2 rounded-xl ${
              activeTab === "reinforce" ? "bg-indigo-600" : "bg-gray-700"
            }`}
          >
            Advance Strengths 💪
          </button>
        </div>

        {recommendations.length === 0 ? (
          <p>No recommendations found for this category.Please add more skills in profile.</p>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((r, i) => (
              <CourseCard key={i} course={r.course} onAdd={handleAddCourses} />
            ))}
          </section>
        )}
         <Pagination page={data.page} total={data.totalResults} limit={data.limit} onPage={(p) => setPage(p)} />
      </main>
    </>
  );
}
