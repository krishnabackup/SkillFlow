
import { useParams } from "react-router-dom"
import CourseProgress from "../../analytics/components/CourseProgress"
import YoutubePlayer from "../components/YoutubePlayer"
import { useRef } from "react"
export default function SingleCoursePage(){
    const playRef = useRef(null);
    return(
        <>
        <CourseProgress/>
        <YoutubePlayer url="" playRef={playRef}/>
        </>
    )
}