import { Handle,Position } from "@xyflow/react";
export function CustomNode({ data }) {
  return (
    <div
      className="
        bg-gradient-to-br from-yellow-400 to-amber-500
        text-black font-semibold text-base
        p-4 min-w-[180px] min-h-[100px]
        rounded-2xl shadow-lg border border-yellow-700/30
        flex justify-center items-center text-center
        transition-all duration-300 transform hover:scale-105 hover:shadow-2xl
      "
    >
        <Handle
        type="target"
        position={Position.Left}
        className="!bg-amber-600 w-3 h-3 rounded-full border border-yellow-200"
        />
      <span>{data.label}</span>
      <Handle
      type="source"
      position={Position.Right}
      className="!bg-amber-600 w-3 h-3 rounded-full border border-yellow-200"
      />
    </div>
  );
}