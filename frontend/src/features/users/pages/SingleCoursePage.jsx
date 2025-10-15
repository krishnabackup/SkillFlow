import Navbar from "../../../components/NavBar"

import { useParams } from "react-router-dom"
import CourseProgress from "../../analytics/components/CourseProgress"
import EmbededBrowser from "../components/EmbededBrowser"
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

export default function SingleCoursePage(){
    return(
        <>
        <Navbar links={links}></Navbar>
        <CourseProgress/>
        <EmbededBrowser url="https://www.youtube.com/watch?v=WTQv10OjpBg"/>
        </>
    )
}