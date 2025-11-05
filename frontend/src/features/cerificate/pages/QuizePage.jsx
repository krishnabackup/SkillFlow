
export default function QuizPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow-2xl p-8 text-gray-100 mb-20">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-yellow-400">
            Question:
          </h2>
          <p className="text-gray-200 text-lg leading-relaxed">
            Which of the following is a JavaScript framework for building user
            interfaces?
          </p>
        </div>

        {/* Options Section */}
        <div className="space-y-4">
          {["Angular", "React", "Laravel", "Django"].map((option, idx) => (
            <label
              key={idx}
              className="flex items-center bg-gray-700 hover:bg-gray-600 rounded-lg p-3 cursor-pointer transition"
            >
              <input
                type="radio"
                value={option}
                name = "opton"
                id={`option${idx}`}
                className="w-5 h-5 accent-yellow-400"
              />
              <span className="ml-3 text-lg">{option}</span>
            </label>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded-full transition">
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
}
