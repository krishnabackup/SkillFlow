import { useEffect, useRef, useState } from "react";
import { generateQuiz, submitQuiz} from "../../../services/QuizServices";
import { useParams } from "react-router-dom";
import { getCourseById } from "../../../services/courseservices";
import { ToastContainer,toast,Bounce } from "react-toastify";
import Spinner from "../../../components/Spinner";
import CongratualtionPage from "./CongratualtionPage";
export default function QuizPage() {
  const {courseId} = useParams();
  const [quiz,setQuiz] = useState([{
    question : "Which among is a Javascript library",
    options : ["A) Angular","B) Next.js", "C) React" , "D) MongoDB "],
    correct_answer : ""
  }]);
  const [isLoading,setIsLoading] = useState(false);
  const [currentQestion,setCurrentQuestion] = useState({
    index : 0,
    selectedValue : ""
  });
  const [answers,setAnswers] = useState([]);
  const [congrates,setCongrates] = useState({
    success : false , 
    response : {}
  });
  useEffect(()=> {
    const getQuizFromBackend = async(id) => {
      try {
        const res = await generateQuiz(id);
        setQuiz(res.quiz);
        setIsLoading(false);
      }
      catch(error) {
        console.error("Error fetching quiz : ",error);
      }
    }
    getQuizFromBackend(courseId);
  },[courseId]);
  const nextButton = () => {
    setCurrentQuestion(prev => ({...prev , index : prev.index + 1}));
  }
  const prevButton = () => {
    setCurrentQuestion(prev => ({...prev , index : prev.index - 1}));
  }
  const submitButton = async () => {
    let score = 0;
  answers.forEach((answer, i) => {
    if (answer === quiz[i].correct_answer) {
      score++;
    }
  });
   try {
   const res = await submitQuiz(courseId,score);
  console.log(res);
  if(res.passed === true) {
    setCongrates({success : true , response : res})
    console.log(congrates)
  }
   }
   catch(error) {
   toast.error("Error submitting. Try Again")
   console.error("Error submitting Quiz : ",error);
   }
   
  }
  const handleChange = (event) => {
     const val = event.target.value;
  setAnswers(prev => {
    const newAnswers = [...prev];
    newAnswers[currentQestion.index] = val;  // Save answer for current question
    return newAnswers;
  }); 
 }
 if(isLoading) return <Spinner/>
return(
    <>   
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      {
        congrates.success ? <CongratualtionPage response={congrates.response} /> :
      <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow-2xl p-8 text-gray-100 mb-20">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-yellow-400">
            Question {currentQestion.index + 1}:
          </h2>
          <p className="text-gray-200 text-lg leading-relaxed">
           {quiz[currentQestion.index].question}
          </p>
        </div>

        <div className="space-y-4">
          {quiz[currentQestion.index].options.map((option, idx) => (
            <label
              key={idx}
              className="flex items-center bg-gray-700 hover:bg-gray-600 rounded-lg p-3 cursor-pointer transition"
            >
              <input
                type="radio"
                value={option}
                name = "opton"
                id={`option${idx}`}
                checked = {answers[currentQestion.index] === option}
                onChange={handleChange}
                className="w-5 h-5 accent-yellow-400"
              />
              <span className="ml-3 text-lg">{option}</span>
            </label>
          ))}
        </div>

        <div className="mt-8 text-center flex justify-between">
          { currentQestion.index > 0 ? <button onClick = {prevButton} className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded-full transition">
            Previous
          </button> : <div></div>}
          { currentQestion.index < 9 ? <button onClick = {nextButton} className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded-full transition">
            Next
          </button> : <div></div>}
           { currentQestion.index === 9 && <button onClick = {submitButton} className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded-full transition">
            Submit
          </button>}
        </div>
      </div>
}
    </div>
    </>
  );
}
