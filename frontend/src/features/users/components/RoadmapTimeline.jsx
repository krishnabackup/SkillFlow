
import RoadmapStageCard from "./RoadmapCard";

export default function RoadmapTimeline({ roadmap, onEnroll }) {
  if (!roadmap) return <div>Loading...</div>;
  const { title, totalduration, stages = [] } = roadmap;
  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <div className="text-sm text-gray-400">Total weeks: {totalduration}</div>
      </header>

      <div className="space-y-6">
        {stages.map((s, i) => (
          <RoadmapStageCard key={s._id || i} stage={s} index={i} onEnroll={onEnroll} />
        ))}
      </div>
    </div>
  );
}
