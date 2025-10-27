
export default function RoadmapStageCard({ stage, index, onEnroll }) {
  return (
    <div className="flex items-start gap-4">
      {/* Timeline dot & connector */}
      <div className="flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-indigo-500" aria-hidden />
        { /* vertical line; hide for last stage if you like */ }
        <div className="w-px h-full bg-gray-700/50 mt-2" />
      </div>

      {/* Card */}
      <div className="bg-white/5 p-4 rounded-md w-full">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-white">{index + 1}. {stage.stage}</h3>
            <p className="text-sm text-gray-300">{stage.description}</p>
            <p className="text-xs text-gray-400 mt-1">Duration: {stage.durationperweeks} week(s)</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2">
          {stage.recommended_courses?.map(course => (
            <div key={course._id} className="p-2 bg-gray-800 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-white">{course.title}</div>
                  <div className="text-xs text-gray-400">{course.description}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => onEnroll(course._id)} className="text-xs px-2 py-1 bg-indigo-600 rounded">Enroll</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
