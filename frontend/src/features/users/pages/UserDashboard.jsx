import { Links } from "react-router-dom";
import Navbar from "../../../components/NavBar";
import GoalsTextArea from "../components/GoalsTextArea";
const links = [
    {
        label : "Home", link : '/home'
    },
    {
        label : "Courses" , link : "/courses"
    },
    {
        label : "Recommandation" , link : "/recommandation"
    },
    {
        label : "Generate Roadmap" , link : "/roadmapgeneration"
    },
    {
        label : "My Profile",link : "/profile"
    }
    
]
export default function UserDashBoard() {
    return(
        <>
        <Navbar links={links}/>
        <div className="flex justify-center items-center mt-10">
          <GoalsTextArea/>
        </div>
        </>
    )
}