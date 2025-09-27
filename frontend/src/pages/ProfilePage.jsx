import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getProfile, updateProfile } from '../services/userservices';
import Navbar from '../components/NavBar';

export default function ProfilePage() {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();
  const [serverMsg, setServerMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await getProfile();
        const user = res.data;
        setValue('name', user.name || '');
        setValue('email', user.email || '');
        setValue('availabilityHours', user.profile?.availabilityHours ?? 5);
        // convert skills array to comma string
        const skillsArr = user.profile?.skills?.map(s => s.name) || [];
        setValue('skills', skillsArr.join(', '));
      } catch (err) {
        console.error('Load profile failed', err);
      }
    })();
  }, [setValue]);

  const onSubmit = async (data) => {
    setServerMsg('');
    try {
      // convert skills string to array
      const payload = {
        name: data.name,
        email: data.email,
        availabilityHours: Number(data.availabilityHours),
        skills: data.skills // backend accepts string or array
      };
      const res = await updateProfile(payload);
      setServerMsg('Profile updated successfully');
    } catch (err) {
      console.error(err);
      setServerMsg(err?.response?.data?.message || 'Update failed');
    }
  };

  return (
    <>
    <Navbar/>
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 text-white">My Profile</h2>
      {serverMsg && <div className="mb-4 text-sm text-indigo-700">{serverMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm mb-1">Full name</label>
          <input {...register('name', { required: true, minLength: 2 })} className="w-full px-3 py-2 border rounded" />
          {errors.name && <p className="text-xs text-red-600">Name is required (min 2)</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input {...register('email', { required: true })} type="email" className="w-full px-3 py-2 border rounded" />
          {errors.email && <p className="text-xs text-red-600">Valid email required</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Skills (comma separated)</label>
          <input {...register('skills')} className="w-full px-3 py-2 border rounded" placeholder="HTML, CSS, JavaScript" />
          <p className="text-xs text-gray-500 mt-1">Example: HTML, CSS, React</p>
        </div>
        <div>
          <label className="block text-sm mb-1">Levels</label>
          <input {...register('skills')} className="w-full px-3 py-2 border rounded" placeholder="HTML, CSS, JavaScript" />
          <p className="text-xs text-gray-500 mt-1">Example: HTML, CSS, React</p>
        </div>

        <div>
          <label className="block text-sm mb-1">Availability (hours/week)</label>
          <input {...register('availabilityHours', { valueAsNumber: true })} type="number" min="0" className="w-32 px-3 py-2 border rounded" />
        </div>

        <div className="flex justify-center">
          <button disabled={isSubmitting} className="w-40 bg-indigo-600 text-white py-2 rounded">
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
    </>
  );
}
