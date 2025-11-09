
import { useParams } from "react-router-dom"
import CourseProgress from "../../analytics/components/CourseProgress"
import YoutubePlayer from "../components/YoutubePlayer"
import { useEffect, useRef, useState } from "react"
import { getCourseById } from "../../../services/courseservices";
import QuizPage from "../../cerificate/pages/QuizePage";
import CourseCompletionBox from "../components/CourseCompletionBox";
import { getProgress } from "../../../services/ProgressServices";
export default function SingleCoursePage(){
    const playRef = useRef(null);
    const {courseId} = useParams();
    const [resourcesyoutube,setResourcesYoutube] = useState("");
    const [course,setCourse] = useState({});
    const [progress,setProgress] = useState(0);
    const [quiz,setQuiz] = useState(false);
    useEffect(() => {
    const fetchCourseById = async () => {
      try {
        const course = await getCourseById(courseId);
        setCourse(course)
        const res  = await getProgress(courseId);
        setProgress(res.progress[res.progress.length -1].progressPercent);
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
        <CourseProgress course={course} progress={progress}/>
        {
          quiz ?  <CourseCompletionBox courseId={courseId}/>:  <YoutubePlayer url={resourcesyoutube} courseId = {courseId} playRef={playRef} setProgress={setProgress} setQuiz={setQuiz}/>
        }
        </>
    )
}