import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getProfile, updateProfile } from '../../../services/userservices';
import { ListGroup, Button } from 'react-bootstrap';

const levelMap = {
  'Beginner': 1,
  'Intermediate': 2,
  'Experienced': 3
}
export default function ProfilePage() {
  const { register, handleSubmit, setValue, watch, resetField, formState: { errors, isSubmitting } } = useForm();
  const [skillsArray, setSkillsArray] = useState([]);
  const [serverMsg, setServerMsg] = useState('');
  const [isEditting, setIsedittting] = useState(true);
  const skills = watch('skills', '')
  const level = watch('levels', ' ')
  const isSkillButtonAvailable = skills.trim() !== '' && level !== '';
  const handleSkills = () => {
    setSkillsArray((prev) => [
      ...prev, {
        name: skills.trim(), level: levelMap[level]
      }
    ])
    resetField('skills')
    resetField('levels')
  }
  const deleteSkills = (index) => {
    setSkillsArray((prev) => prev.filter((_, i) => i !== index))
  }
  useEffect(() => {
    (async () => {
      try {
        const res = await getProfile();
        const user = res.data;
        setValue('name', user.name || '');
        setValue('email', user.email || '');
        setValue('availabilityHours', user.profile?.availabilityHours ?? 5);
        console.log(user.profile?.current_role);
        setValue('current_role', user.profile?.current_role || "");
        // convert skills array to comma string
        setSkillsArray(user.profile?.skills || []);
      } catch (err) {
        console.error('Load profile failed', err);
      }
    })();
  }, [setValue]);

  const onSubmit = async (data) => {
    if (isEditting) {
      setIsedittting(false);
      setServerMsg('');
    }
    else {
      setServerMsg('');
      try {
        data.skills = skillsArray;
        const payload = {
          name: data.name,
          email: data.email,
          current_role: data.current_role,
          availabilityHours: Number(data.availabilityHours),
          skills: data.skills // backend accepts string or array
        };
        await updateProfile(payload);
        alert('Profile updated successfully');
        const res = await getProfile();           // Fetch latest profile after update
        const user = res.data;
        setSkillsArray(user.profile?.skills || []); // Update skills in state!
        setValue('name', user.name || '');
        setValue('email', user.email || '');
        setValue('availabilityHours', user.profile?.availabilityHours ?? 5);
        setValue('current_role', user.profile?.current_role || "");
        alert('Profile updated successfully');
        setIsedittting(true);
      } catch (err) {
        console.error(err);
        setServerMsg(err?.response?.data?.message || 'Update failed');
      }
    }
  };


  return (
    <>
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4 text-white">My Profile</h2>
        {serverMsg && <div className="mb-4 text-sm text-indigo-700">{serverMsg}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow">
          <div>
            <label className="block text-sm mb-1">Full name</label>
            <input {...register('name', { required: true, minLength: 2 })} className="w-full px-3 py-2 border rounded" disabled={isEditting} />
            {errors.name && <p className="text-xs text-red-600">Name is required (min 2)</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input {...register('email', { required: true })} type="email" className="w-full px-3 py-2 border rounded" disabled={isEditting} />
            {errors.email && <p className="text-xs text-red-600">Valid email required</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Role</label>
            <select
              disabled={isEditting}
              className='rounded border'
              {...register('current_role', { required: "Please select a role" })}
              defaultValue=""
            >
              <option value="" disabled>
                Select a Role
              </option>
              <option value="student">
                Student
              </option>
              <option value="fresher">Fresher</option>
              <option value="experienced">Experienced</option>
            </select>
            {errors.current_role && <p className='text-xs text-red-600 mt-1'>{errors.current_role.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Skills (comma separated)</label>
            <input {...register('skills')} className="w-full px-3 py-2 border rounded" placeholder="HTML, CSS, JavaScript" disabled={isEditting} />
            <p className="text-xs text-gray-500 mt-1">Example: HTML, CSS, React</p>
          </div>
          <div className="flex gap-8">
            <div className="inline-flex items-center">
              <label className="relative flex items-center cursor-pointer" htmlFor="beginner">
                <input
                  disabled={isEditting}
                  name="level"
                  type="radio"
                  value="Beginner"
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-blue-400 transition-all"
                  id="beginner"
                  {...register('levels')}
                />
                <span className="absolute bg-blue-600 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
              </label>
              <label className="ml-2 text-slate-600 cursor-pointer text-sm" htmlFor="beginner">
                Beginner
              </label>
            </div>
            <div className="inline-flex items-center">
              <label className="relative flex items-center cursor-pointer" htmlFor="intermediate">
                <input
                  name="level"
                  disabled={isEditting}
                  type="radio"
                  value="Intermediate"
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-blue-400 transition-all"
                  id="intermediate"
                  {...register('levels')}
                />
                <span className="absolute bg-blue-600 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
              </label>
              <label className="ml-2 text-slate-600 cursor-pointer text-sm" htmlFor="intermediate">
                Intermediate
              </label>
            </div>
            <div className="inline-flex items-center">
              <label className="relative flex items-center cursor-pointer" htmlFor="experienced">
                <input
                  name="level"
                  type="radio"
                  disabled={isEditting}
                  value="Experienced"
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-blue-400 transition-all"
                  id="experienced"
                  {...register('levels')}
                />
                <span className="absolute bg-blue-600 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
              </label>
              <label className="ml-2 text-slate-600 cursor-pointer text-sm" htmlFor="experienced">
                Experienced
              </label>
            </div>
          </div>
          <button className="bg-violet-400 text-base p-3 rounded-full font-bold hover:bg-violet-700 font-mono" disabled={!isSkillButtonAvailable} onClick={handleSkills}>Add Skill </button>
          {
            skillsArray.length > 0 && (
              <div className="mt-4">
                <ListGroup>
                  {skillsArray.map((skill, index) => (
                    <ListGroup.Item
                      key={index}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div className=" flex- justify-center align-middle gap-2 mt-2">
                        {skill.name} - ({skill.level})
                        {
                          !isEditting && <Button
                            className="bg-red-500 rounded-full p-2 uppercase font-bold text-sm ml-2"
                            onClick={() => deleteSkills(index)}
                          >
                            Delete
                          </Button>
                        }

                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}
          <div>
            <label className="block text-sm mb-1">Availability (hours/week)</label>
            <input disabled={isEditting} {...register('availabilityHours', { valueAsNumber: true })} type="number" min="0" className="w-32 px-3 py-2 border rounded" />
          </div>

          <div className="flex justify-center">
            <button disabled={isSubmitting} className="w-40 bg-indigo-600 text-white py-2 rounded">
              {isEditting ? 'Edit the Profile' : isSubmitting ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
