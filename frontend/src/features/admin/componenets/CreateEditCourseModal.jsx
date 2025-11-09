// src/components/CreateEditCourseModal.jsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateCourses, useUpdateCourses } from '../../../hooks/useAdminCourses';
import { toast } from 'react-toastify';

export default function CreateEditCourseModal({ course, onClose }) {
  const { register, handleSubmit, reset, setValue } = useForm();
  const createMut = useCreateCourses();
  const updateMut = useUpdateCourses();

  useEffect(() => {
    reset(course || { title: '', description: '', skills: [], difficulty: 'beginner', url: '', res_type: '' , res_title : '' ,estimatedHours : 5});
      if (course) {
    setValue("title", course.title || "");
    setValue("estimatedHours", course.estimatedHours || 5);
    setValue("description", course.description || "");
    setValue("skills", course.skills ? course.skills.join(", ") : "");
    // Defensive checks for resources[0]
    if (course.resources && course.resources.length > 0) {
      setValue("url", course.resources[0].url || "");
      setValue("res_type", course.resources[0].type || "");
      setValue("res_title", course.resources[0].title || "");
    } else {
      setValue("url", "");
      setValue("res_type", "");
      setValue("res_title", "");
    }
  }
  }, [course, reset, setValue]);

  const onSubmit = async (data) => {
    // Convert comma-separated skills string to array if needed
    data.skills = typeof data.skills === 'string'
      ? data.skills.split(',').map(s => s.trim()).filter(Boolean)
      : data.skills;
      data.resources = [{ title : data.res_title , url: data.url, type: data.res_type }];
    try {
      if (course && course._id) {
        await updateMut.mutateAsync({ id: course._id, payload: data });
        toast.success('Updated Course Successfully');
      } else {
        await createMut.mutateAsync(data);
        toast.success('Created Course Successfully');
      }
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to process course');
    }
  };

  const onError = (err) => {
    console.log('Form validation errors:', err);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <form
          className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow space-y-6 overflow-y-auto max-h-[90vh]"
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
              Name
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
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
              {...register('difficulty', { required: 'Difficulty is required' })}
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
              {...register('skills', { required: 'Skills is required' })}
              id="skills"
              name="skills"
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Enter skills, comma separated"
            />
          </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
              Estimated Hours
            </label>
            <input
              {...register('estimatedHours')}
              id="estimatedHours"
              name="estimatedHours"
              type='number'
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Enter estimatedHours"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="resources">
              Resource Title
            </label>
            <input
              {...register('res_title', { required: 'Resource Title is required' })}
              id="res_title"
              name="res_title"
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Enter resource title"
            />
          </div>
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="url">
              Resource Link
            </label>
            <input
              {...register('url', { required: 'Resource link is required' })}
              id="url"
              name="url"
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Enter resource url"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="res_type">
              Resource Type
            </label>
            <input
              {...register('res_type', { required: 'Type is required' })}
              id="res_type"
              name="res_type"
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Enter resource type"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {course ? 'Edit Course' : 'Create Course'}
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
