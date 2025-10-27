
import Navbar from '../../../components/NavBar';
import { useRoadmap, useGenerateRoadmap } from '../../../hooks/useRoadmap';
import RoadmapGraph from '../components/RoadMapGraph';
import { Link } from 'react-router-dom';
export default function RoadmapPage(){
  const { data: roadmap, isLoading } = useRoadmap();
  const gen = useGenerateRoadmap();

  const handleEnroll = async (courseId) => {
    // call enroll API (not implemented here)
    console.log('enroll', courseId);
  }
  if (!roadmap?.roadmap || roadmap?.roadmap.length === 0) {
    return (
      <>
      <Navbar></Navbar>
      <div className="p-6 text-center text-white">You have no Roadmap to show. <Link className="text-blue-500" to="/home">Generate a Roadmap</Link></div>
      </>
    )
  }
  return (
    <>
    <Navbar/>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-white">{roadmap?.roadmap?.[0].title}</h2>
          <button className="px-3 py-2 bg-emerald-500 rounded" onClick={() => gen.mutate()}>
            Regenerate
          </button>
        </div>

        {isLoading ? <div>Loading...</div> : <RoadmapGraph roadmap={roadmap?.roadmap?.[0]} onSave={handleEnroll} />}
      </div>
    </>
  );
}
