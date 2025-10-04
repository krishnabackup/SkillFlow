import { useForm } from "react-hook-form"
import { useCreateUserByAdmin } from "../../../hooks/useUsers";
export default function CreateModel({user,onClose}){
    const {register,handleSubmit} = useForm();
    const createUsermutation = useCreateUserByAdmin();
    const onSubmit = async (data) => {
      await createUsermutation.mutateAsync(data, {role : "admin"});
      onClose();
    }
    const onError = (eror) => {
        console.log("Message" , eror)
    }
  return(
    <>
     <div className="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-50 z-50"
    onClick={onClose}
    >
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md'
      onClick={e => e.stopPropagation()}
      >
           <form className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow space-y-6" onSubmit={handleSubmit(onSubmit,onError)}>
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
      Name
    </label>
    <input
      {...register('name',{required : "title is required"})}
      id="title"
      type="text"
      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
      placeholder="Enter name"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
      Email
    </label>
    <input
       {...register('email')}
      id="description"
      rows={3}
      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
      placeholder="Enter Email"
    />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="difficulty">
      Password
    </label>
    <input
      {...register('password',{required : "Difficulty is required"})}
      id="difficulty"
      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
      defaultValue=""
    />
  </div>
  <button
    type="submit"
    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
  >
    Create Admin
  </button>
</form>
            <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
    </>
  )
}