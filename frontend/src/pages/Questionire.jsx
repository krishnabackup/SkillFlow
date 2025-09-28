import Navbar from "../components/NavBar"
import { useForm } from "react-hook-form"
import { Form, Button, ListGroup } from "react-bootstrap"
import { useState } from "react";
import {updateProfile } from "../services/userservices";
import { useNavigate } from "react-router-dom";

const levelMap = {
    'Beginner' : 1,
    'Intermediate' : 2,
    'Experienced' : 3
}
export default function Questionire() {
    const {register,handleSubmit,watch,resetField,formState:{errors,isSubmitting}} = useForm();
    const nav = useNavigate();
    const skills = watch('skills','')
    const level = watch('level','')
    const [skillArray,setSkillArray] = useState([]);
    const isAddSkillEnabled = skills.trim() !== '' && level !== '';
    const onSubmit = (data) => {
      data.skills = skillArray
      const payload = {
     profile: {
    current_role: data.current_role,
    availabilityHours: Number(data.availabilityHours),
    skills: skillArray
    }
   };

      console.log(payload)
      try {
          updateProfile(payload);
          nav('/profile');
      }
      catch(error) {
        console.log(error)
      }
    }
    const handleSkills = () => {
        setSkillArray((prev) => [
            ...prev , {
                name : skills.trim(),level : levelMap[level]
            },
        ]);
        resetField('skills');
    }
    const deleteSkills = (index) => {
        setSkillArray((prev) => prev.filter((_,i) => i !== index));
    }
    return(
        <>
        <Navbar/>
        <div className="flex justify-between ml-5 p-10 mt-5 mr-10 text-yellow-400 ">
            <div>
              <Form action="" className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
               <Form.Group controlId="current_role">
                <Form.Label className="mr-5">Current Role : </Form.Label>
                <Form.Select
                {...register('current_role',{required : "Please select a role"})}
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
                </Form.Select>
                {errors.current_role && <p className='text-xs text-red-600 mt-1'>{errors.current_role.message}</p> }
                </Form.Group>
                <Form.Group>
                    <Form.Label className="mr-5">Skills : </Form.Label>
                    <Form.Control 
                    type="text" 
                    {...register('skills')}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId="levels" className="mt-3">
                    <Form.Label className="mr-5">Level</Form.Label>
                    <div className="d-flex gap-3">
                    <Form.Check
                    type="radio"
                    name="level"
                    label="Beginner"
                    value="Beginner"
                    {...register('level')}
                    inline
                    >
                    </Form.Check>
                     <Form.Check
                    type="radio"
                    name="level"
                    label="Intermediate"
                    value="Intermediate"
                    {...register('level')}
                    inline
                    >
                    </Form.Check>
                     <Form.Check
                    type="radio"
                    name="level"
                    label="Experienced"
                    value="Experienced"
                    {...register('level')}
                    inline
                    >
                    </Form.Check>
                    </div>
                </Form.Group>
                <Button className="bg-violet-400 text-base p-3 rounded-full font-bold hover:bg-violet-700 font-mono" disabled={!isAddSkillEnabled} onClick={handleSkills}>Add Skill </Button>
              <div className="flex justify-center align-middle gap-5">
          <label className="block text-sm mb-1">Availability (hours/week)</label>
          <input {...register('availabilityHours', { valueAsNumber: true })} type="number" min="0" className="w-20 h-6 p-2 border rounded" />
        </div>
            <button onClick={handleSubmit(onSubmit)}disabled={isSubmitting} type='submit' className='min-w-[200px] mx-auto font-bold bg-indigo-400 text-black py-2 rounded-3xl hover:bg-indigo-600 disabled:opacity-60'>{isSubmitting ? 'Confirming...' : 'Confirm'}</button>
            </Form>
              </div>
              <div>
                  {
                    skillArray.length > 0 && (
                        <div className="mt-4">
          <h5 className="text-4xl text-white font-extrabold ">Skills Added:</h5>
          <ListGroup>
            {skillArray.map((skill, index) => (
              <ListGroup.Item
                key={index}
                className="d-flex justify-content-between align-items-center"
              >
                <div className=" flex- justify-center align-middle gap-2 mt-2">
                  {skill.name} - {skill.levelName} ({skill.level})
               
                <Button
                   className="bg-red-500 rounded-full p-2 uppercase font-bold text-sm ml-2"
                  onClick={() => deleteSkills(index)}
                >
                  Delete
                </Button>
                 </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
              </div>
        </div>
        </>
    )
}