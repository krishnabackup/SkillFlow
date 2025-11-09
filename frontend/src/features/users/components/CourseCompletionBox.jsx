
import { useNavigate } from "react-router-dom"
export default function CourseCompletionBox({courseId}) {
    const nav = useNavigate();
    const handleClick = (courseId) => {
        nav(`/courses/${courseId}/quiz`)
    }
  return (
    <div className="flex justify-center items-center mt-40">
          <div className="mt-6 bg-gray-800 p-6 rounded-xl text-center">
          <h3 className="text-lg font-bold mb-2 text-yellow-300 ">🎉 Congratulations!</h3>
          <p className="mb-4 text-lg text-white">You’ve completed the video. Ready for the quiz?</p>
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-black" onClick={() => handleClick(courseId)}>
            Start Quiz
          </button>
        </div></div>
  )
}
