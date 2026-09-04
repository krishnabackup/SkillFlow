import { useForm } from "react-hook-form"
import { Form, Button, ListGroup } from "react-bootstrap"
import { useState } from "react";
import {updateProfile } from "../../../services/userservices";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/NavBar";
import { X } from "lucide-react";
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
    const onSubmit = async (data) => {
    data.skills = skillArray
    const payload = {
    current_role: data.current_role,
    availabilityHours: Number(data.availabilityHours),
    skills: skillArray
   };
      try {
          await updateProfile(payload);
          nav('/home');
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
        <div className="flex flex-col p-3 h-screen justify-center items-start 400 md:flex md:flex-row md:gap-4 md:justify-start md:p-4">
            <div className = "border-2 border-yellow-400 p-10 rounded-lg w-full max-w-md bg-gray-800 text-yellow-300">
              <Form action="" className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
               <Form.Group controlId="current_role">
                <Form.Label className="mr-5">Current Role : </Form.Label>
                <Form.Select
                className="border rounded p-0.5 text-black"
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
                    className="border rounded p-0.5 text-black"
                    {...register('skills')}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId="levels" className="mt-3">
                    <Form.Label className="mr-5">Level</Form.Label>
                    <div className="flex flex-col justify-content">
                    <Form.Check
                    type="radio"
                    name="level"
                    label="Beginner"
                    value="Beginner"
                    {...register('level')}
                    inline
                    className="flex gap-2"
                    >
                    </Form.Check>
                     <Form.Check
                    type="radio"
                    name="level"
                    label="Intermediate"
                    value="Intermediate"
                    {...register('level')}
                    inline
                    className="flex gap-2"
                    >
                    </Form.Check>
                     <Form.Check
                    type="radio"
                    name="level"
                    label="Experienced"
                    value="Experienced"
                    {...register('level')}
                    inline
                    className="flex gap-2"
                    >
                    </Form.Check>
                    </div>
                </Form.Group>
                <Button className="bg-violet-400 text-base p-3 rounded-full font-bold hover:bg-violet-700 font-mono" disabled={!isAddSkillEnabled} onClick={handleSkills}>Add Skill </Button>
          <ListGroup className="flex gap-2 flex-wrap">
            {skillArray.length > 0 && skillArray.map((skill, index) => (
              <ListGroup.Item
                key={index}
              >
                <div className="relative border border-black bg-gray-400 text-black rounded-lg p-1">
                  <span className="pr-2">
                  {skill.name} - {skill.levelName} ({skill.level})
                  </span>
                <Button
                  className="text-black absolute top-0 text-sm right-0"
                  onClick={() => deleteSkills(index)}
                >
                 <X size={13}></X>
                </Button>
                 </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
              <div className="flex gap-3 items-center">
          <label className="block text-sm mb-1">Availability (hours/week) : </label>
          <input {...register('availabilityHours', { valueAsNumber: true })} type="number" min="0" className="w-20 h-6 p-2 border rounded text-black" />
        </div>
            <button onClick={handleSubmit(onSubmit)}disabled={isSubmitting} type='submit' className='min-w-[200px] mx-auto font-bold bg-indigo-400 text-black py-2 rounded-3xl hover:bg-indigo-600 disabled:opacity-60'>{isSubmitting ? 'Confirming...' : 'Confirm'}</button>
            </Form>
              </div>
        </div>
        </>
    )
}