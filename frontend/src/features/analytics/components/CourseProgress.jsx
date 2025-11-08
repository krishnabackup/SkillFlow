
export default function CourseProgress({ course, enrollment }) {
  return (
    <div className="p-4 bg-gray-900 rounded">
      <div className="flex justify-between mb-2">
        <h3 className="text-white">{course.title}</h3>
        <span className="text-sm text-gray-400">50%</span>
      </div>
      <div className="w-full bg-gray-700 h-3 rounded">
        <div className="bg-emerald-400 h-3 rounded" style={{ width: `${50}%` }} />
      </div>
    </div>
  );
}
