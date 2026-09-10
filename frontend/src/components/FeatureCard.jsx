   
export default function FeatureCard({ title, description }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-gray-600">
        {description}
      </p>

    </div>
  );
}

