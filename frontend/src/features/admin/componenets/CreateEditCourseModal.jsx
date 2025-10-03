// src/components/CreateEditCourseModal.jsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateCourses, useUpdateCourses } from '../../../hooks/useAdminCourses';

export default function CreateEditCourseModal({course, onClose}){
  const { register, handleSubmit, reset ,setValue } = useForm();
  const createMut = useCreateCourses();
  const updateMut = useUpdateCourses();
  console.log(course);
  useEffect(()=> { 
    reset(course || { title:'', description:'', skills:[], difficulty:'beginner' }) 
  }, [course, reset, setValue]);
  const onSubmit = async (data) => {
    // convert comma skills string to array if needed
    data.skills = typeof data.skills === 'string' ? data.skills.split(',').map(s=>s.trim()).filter(Boolean) : data.skills;
    if (course && course._id) {
      await updateMut.mutateAsync({ id: course._id, payload: data });
    } else {
      alert("created");
      await createMut.mutateAsync(data);
    }
    onClose();
  };
  
const onError = (err) => {
  console.log("Form validation errors:", err);
};
  return (
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
      {...register('title',{required : "title is required"})}
      id="title"
      name="title"
      type="text"
      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
      placeholder="Enter name"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
      Description
    </label>
    <textarea
       {...register('description')}
      id="description"
      name="description"
      rows={3}
      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
      placeholder="Enter description"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="difficulty">
      Difficulty
    </label>
    <select
      {...register('difficulty',{required : "Difficulty is required"})}
      id="difficulty"
      name="difficulty"
      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
      defaultValue=""
    >
      <option value="" disabled>Select difficulty</option>
      <option value="beginner">Beginner</option>
      <option value="intermediate">Intermediate</option>
      <option value="advanced">Advanced</option>
    </select>
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="skills">
      Skills
    </label>
    <input
      {...register('skills',{required : "Skills is required"})}
      id="skills"
      name="skills"
      type="text"
      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
      placeholder="Enter skills, comma separated"
    />
  </div>

  <button
    type="submit"
    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
  >
    {course ? "Edit Course" : "Create Courses"}
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
  );
}