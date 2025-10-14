import React, { useState, useEffect } from 'react';

export default function StagePanel({ stage, onUpdate, onAddStage, onDeleteStage }) {
  const [form, setForm] = useState(null);

  useEffect(() => {
    setForm(stage ? { ...stage } : null);
  }, [stage]);

  if (!form) {
    return (
      <div>
        <h3 className="text-white text-lg">No stage selected</h3>
        <button
          onClick={() => {
            const newStage = {
              _id: `stage_${Date.now()}`,
              stage: 'New Stage',
              description: '',
              durationperweeks: 1,
              skills: [],
              recommended_courses: [],
              position: { x: 100, y: 100 },
            };
            onAddStage(newStage);
          }}
          className="mt-4 px-3 py-2 bg-blue-600 rounded"
        >
          Add Stage
        </button>
      </div>
    );
  }

  function handleSave() {
    onUpdate(form);
  }

  return (
    <div>
      <h3 className="text-white text-lg mb-2">Details</h3>

      <label className="text-sm text-gray-300">Title</label>
         <h1  
        className="w-full mb-2 p-2 rounded bg-gray-900 text-white"
      > {form.stage}</h1>


      <label className="text-sm text-gray-300">Description</label>
        <h1  
        className="w-full mb-2 p-2 rounded bg-gray-900 text-white"
      > {form.description}</h1>


      <label className="text-sm text-gray-300">Duration (weeks)</label>
      <h1  
        className="w-full mb-2 p-2 rounded bg-gray-900 text-white"
      > {form.duration_weeks}</h1>

      <label className="text-sm text-gray-300">Skills to Learn</label>
      {stage.skills?.map((skill, idx) => (
        <h2 key={idx} className='text-white text-base'>{skill}</h2>
      ))}

      <label className="text-sm text-gray-300 mt-4 block">Resources</label>
      {
        stage.recommended_courses?.map((rc) => 
            rc.resources?.map((rec,recIndx) => (
          <div key={recIndx} className="mb-2 p-2 bg-gray-800 rounded">
          <h2 className='text-white text-base font-semibold'>{rc.title}</h2>
          <a
            href={rec.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-sm underline"
          >
            {rec.url}
          </a>
          <div className="text-gray-400 text-xs">{rec.type}</div>
            </div>
        )
      )
      )
        }
        </div>
  );
}
