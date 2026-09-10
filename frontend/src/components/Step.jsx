
export default function Step({ number, title }) {
  return (
    <div className="rounded-xl border border-gray-200 p-6 text-center bg-white">

      <span className="text-sm font-semibold text-blue-600">
        {number}
      </span>

      <h3 className="mt-3 font-semibold">
        {title}
      </h3>

    </div>
  );
}