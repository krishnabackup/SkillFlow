import { useForm } from "react-hook-form"
import { updateProfile } from "../../../services/userservices";


export default function GoalsTextArea(){
    const {handleSubmit,register,resetField,formState:{errors}} = useForm();
    const handleLearn = async (data) => {
    await updateProfile(data);
    resetField('goals');
    }
    return(
        <>
        <div className="w-2/4 mt-14">
           <form onSubmit={handleSubmit(handleLearn)}>
            <div >
             <textarea
              {...register('goals',{required : "Goal is required"})}
              className=" w-full h-56 border-2 box-border shadow-lg bg-gray-600 text-white font-serif p-3"
             name="goals" id="goals" placeholder="Enter the goal you want to achieve like I want to become a fullstack developer"></textarea>
            </div>
            <div className="flex justify-end mt-3">
                <button type="submit" className="bg-indigo-400 text-black font-bold text-base cursor-pointer p-2 rounded-full hover:bg-indigo-800">Learn</button>
            </div>
            {errors.goals && <p className="text-red-500">{errors.goals?.message}</p>}
            </form>
        </div>
        </>
    )
}