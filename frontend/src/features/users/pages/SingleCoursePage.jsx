
import { useParams } from "react-router-dom"
import CourseProgress from "../../analytics/components/CourseProgress"
import YoutubePlayer from "../components/YoutubePlayer"
import { useEffect, useRef, useState } from "react"
import { getCourseById } from "../../../services/courseservices";
export default function SingleCoursePage(){
    const playRef = useRef(null);
    const {courseId} = useParams();
    const [resourcesyoutube,setResourcesYoutube] = useState("");
    useEffect(() => {
    const fetchCourseById = async () => {
      try {
        const course = await getCourseById(courseId);
        const type = course.resources[0].type;
        if(type === "youtube") setResourcesYoutube(course?.resources[0].url)
      } catch (error) {
        console.error("Failed to fetch course:", error);
      }
    };

    if (courseId) {
      fetchCourseById();
    }
  }, [courseId])
    return(
        <>
        <CourseProgress/>
        <YoutubePlayer url={resourcesyoutube} courseId = {courseId} playRef={playRef}/>
        </>
    )
}