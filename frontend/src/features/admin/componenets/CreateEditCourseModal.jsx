// src/components/CreateEditCourseModal.jsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateCourses, useUpdateCourses } from '../../../hooks/useAdminCourses';

export default function CreateEditCourseModal({ course, onClose }){
  const { register, handleSubmit, reset } = useForm();
  const createMut = useCreateCourses();
  const updateMut = useUpdateCourses();

  useEffect(()=> { reset(course || { title:'', description:'', skills:[], difficulty:'beginner' }) }, [course, reset]);

  const onSubmit = async (data) => {
    // convert comma skills string to array if needed
    data.skills = typeof data.skills === 'string' ? data.skills.split(',').map(s=>s.trim()).filter(Boolean) : data.skills;
    if (course && course._id) {
      await updateMut.mutateAsync({ id: course._id, payload: data });
    } else {
      await createMut.mutateAsync(data);
    }
    onClose();
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('title', { required: true, minLength: 3 })} />
        <textarea {...register('description')} />
        <input {...register('skills')} placeholder="comma separated" />
        <select {...register('difficulty')} >
          <option value="beginner">Beginner</option>...
        </select>
        <button type="submit">{course? 'Save' : 'Create'}</button>
      </form>
    </div>
  );
}