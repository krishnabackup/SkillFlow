
import { useEffect, useState } from 'react';
import { useRoadmap, useGenerateRoadmap } from '../../../hooks/useRoadmap';
import RoadmapGraph from '../components/RoadMapGraph';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getPathById } from '../../../services/roadmapservices';
export default function RoadmapPage(){
  const {roadmapId} = useParams();
  const [roadmap,setRoadMap] = useState([]);
  const [isLoading,setIsLoading] = useState(true);
  const gen = useGenerateRoadmap();
  useEffect(()=> {
    try {
      const fetchRoadmapById = async(roadmapID) => {
       const res = await getPathById(roadmapID);
       setRoadMap(res.data.roadmap)
       setIsLoading(false)
      }
      if(roadmapId) fetchRoadmapById(roadmapId)
    }
    catch(error) {
      console.log("Error fetching ",error)
    }
  },[roadmapId])
  const handleEnroll = async (courseId) => {
    // call enroll API (not implemented here)
    console.log('enroll', courseId);
  }
  if (!roadmap || roadmap.length === 0) {
    return (
      <>
      <div className="p-6 text-center text-white">You have no Roadmap to show. <Link className="text-blue-500" to="/home">Generate a Roadmap</Link></div>
      </>
    )
  }
  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-white">{roadmap.title}</h2>
          <button className="px-3 py-2 bg-emerald-500 rounded" onClick={() => gen.mutate()}>
            Regenerate
          </button>
        </div>

        {isLoading ? <div>Loading...</div> : <RoadmapGraph roadmap={roadmap} onSave={handleEnroll} />}
      </div>
    </>
  );
}
