import { useNavigate } from "react-router-dom"

export default function AboutUs() {
    const nav = useNavigate();
    const onSubmit = () => {
     nav("/")
    }
    return(
        <>
        <div className="flex justify-center mt-10">
        <h1 className="text-white text-4xl font-bold font-mono">
            About Page
        </h1>
        </div>
        <div className="min-h-[600px] bg-yellow-50 mb-7 mt-7">
           ehehrewhrewj
        </div>
        <div className="flex justify-center">
            <button onClick= {onSubmit} className=" min-w-[200px] mx-auto font-bold bg-indigo-400 text-black py-2 rounded-3xl hover:bg-indigo-600 disabled:opacity-60' ">Go Back Home</button>
        </div>
        </>
    )
}