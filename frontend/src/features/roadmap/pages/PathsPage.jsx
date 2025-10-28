import Navbar from "../../../components/NavBar";
import { Link } from "react-router-dom";
import { useDeleteRoadmap, useRoadmap} from "../../../hooks/useRoadmap";
export default function PathsPage(){
  const { data: roadmaps, isLoading, isError,isFetching} = useRoadmap();
  const deleteRoadmap = useDeleteRoadmap();
  const roadmap = roadmaps?.roadmap;
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading enrollments.</div>;

  if (!roadmap || roadmap.length === 0) {
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
  return (
    <>
    <Navbar></Navbar>
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-white">My Paths {isFetching && <span className="text-sm text-gray-400">refreshing…</span>}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roadmap.map(r => {
          return (
            <div key={r._id} className="bg-gray-400 p-4 rounded shadow flex flex-col justify-between">
               <h2 className="text-lg font-semibold mb-1 text-black">{r.title}</h2>
        <div className="flex gap-2 items-center">
          <span className="px-2 py-2 rounded text-xs bg-gray-600 text-white">{`Total Duration : ${r.totalduration} weeks`}</span>
        </div>
        <div className="flex gap-2 items-center text-gray-700 mt-2 flex-wrap">
        </div>
              <div className="mt-5 flex items-center justify-between">
                  <Link to={`/paths/${r._id}`} className="px-3 py-1 bg-indigo-600 text-white rounded font-bold">Continue</Link>
                  <button
                  onClick={() => removeRoadmap(r._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded font-bold"
                  >Unenroll</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}