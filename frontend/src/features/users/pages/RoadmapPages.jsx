
import Navbar from '../../../components/NavBar';
import { useRoadmap, useGenerateRoadmap } from '../../../hooks/useRoadmap';
import RoadmapGraph from '../components/RoadMapGraph';
export default function RoadmapPage(){
  const { data: roadmap, isLoading } = useRoadmap();
  console.log(roadmap);
  const gen = useGenerateRoadmap();

  const handleEnroll = async (courseId) => {
    // call enroll API (not implemented here)
    console.log('enroll', courseId);
  }
 const links = [
      {
    label: "Home", link: '/home'
  },
  {
    label: "Courses", link: "/courses"
  },
  {
    label: "MyCourses", link: "/mycourses"
  },
  {
    label: "Recommandation", link: "/recommandation"
  },
  {
    label: "Generate Roadmap", link: "/roadmapgeneration"
  }
 ]
  return (
    <>
    <Navbar links={links}/>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-white">Your Roadmap</h2>
          <button className="px-3 py-2 bg-emerald-500 rounded" onClick={() => gen.mutate()}>
            Regenerate
          </button>
        </div>

        {isLoading ? <div>Loading...</div> : <RoadmapGraph roadmap={roadmap?.roadmap?.[0]} onSave={handleEnroll} />}
      </div>
    </>
  );
}
