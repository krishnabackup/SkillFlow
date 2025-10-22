
import Navbar from '../../../components/NavBar'
import { useParams } from 'react-router-dom'
import { getPathById } from '../../../services/roadmapservices';
import { useEffect } from 'react';
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
]
export default function SinglePathPage() {
    const { pathId } = useParams();
    useEffect(() => {
        try {
          const fetchPath = async (pathId) => {
            const res = await getPathById(pathId);
             console.log(res.data)
        }
        if (pathId) {
            fetchPath(pathId);  
        }
    }
        catch (error) {
            console.error('Error fetching path:', error);
        }
    }, [pathId]);
  return (
    <>
    <Navbar links={links}></Navbar>
    </>
  )
}
