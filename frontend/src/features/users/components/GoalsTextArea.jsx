import { useForm } from "react-hook-form"
import { updateProfile } from "../../../services/userservices";
import { useGenerateRoadmap } from "../../../hooks/useRoadmap";
import { Link } from "react-router-dom";
import { useState } from "react";
export default function GoalsTextArea(){
    const {handleSubmit,register,resetField,formState:{errors}} = useForm();
    const [isGenerated,setIsgenerated] = useState(false);
    const generate = useGenerateRoadmap();

    const handleLearn = async (data) => {
    const goal = {goal : data.goals};
    generate.mutate(goal);
    if(generate.isSuccess)  await updateProfile(data);
    setIsgenerated(true);
    resetField('goals');
    }
    return(
        <>
        <div className="w-full mt-14 md:w-3/4 xl:w-1/2">
           <form onSubmit={handleSubmit(handleLearn)}>
            <div >
             <textarea
              {...register('goals',{required : "Goal is required"})}
              className=" w-full h-56 border-2 box-border shadow-lg bg-gray-600 text-white font-serif p-3"
             name="goals" id="goals" placeholder="Enter the goal you want to achieve like I want to become a fullstack developer"></textarea>
            </div>
            <div className="flex justify-end mt-3">
                <button type="submit" className="bg-indigo-400 text-black font-bold text-base cursor-pointer p-2 rounded-full hover:bg-indigo-800">{generate.isPending ? "Generating" : "Learn"}</button>
            </div>
            {errors.goals && <p className="text-red-500">{errors.goals?.message}</p>}
            </form>
            <div>
                {
                    isGenerated ? generate.isPending ? <h1 className="text-yellow-400 text-2xl font-semibold">Generating roadmap takes some seconds . Please wait.....</h1> 
                    : generate.isSuccess ? <h1 className="text-green-400 text-2xl font-semibold">Roadmap Generated . Click <Link to='/roadmapgeneration'> here</Link></h1> 
                    : <h1 className="text-red-500 text-2xl font-semibold">Failed to generate roadmap. Please try again.</h1>
                    : ""
                }
            </div>
        </div>
        </>
    )
}