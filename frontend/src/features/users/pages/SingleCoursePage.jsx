import Navbar from "../../../components/NavBar"

import { useParams } from "react-router-dom"
import CourseProgress from "../../analytics/components/CourseProgress"
import EmbededBrowser from "../components/EmbededBrowser"

export default function SingleCoursePage(){
    return(
        <>
        <Navbar></Navbar>
        <CourseProgress/>
        <EmbededBrowser url="https://www.youtube.com/watch?v=WTQv10OjpBg"/>
        </>
    )
}