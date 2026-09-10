import { useNavigate } from "react-router-dom"
import { isAuthenticated ,getUserRole } from "../utils/authhelper";
import FeatureCard from "../components/FeatureCard.jsx"
import Step from "../components/Step.jsx"
import NavBar from "../components/NavBar.jsx"
export default function AboutUs() {
    const nav = useNavigate();
    const onSubmit = () => {
         if(isAuthenticated()) nav('/home');
         else nav("/")
    }
    return(
        <>
        <NavBar/>
    <div className="min-h-screen bg-black text-yellow-500">

      {/* Hero */}
      <section className="p-6">
         <p className="mb-4 font-medium text-blue-600">
            ABOUT SKILLFLOW
          </p>
        <div className="mx-auto max-w-4xl text-center">
         

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Learn with direction.
            <br />
            Build with purpose.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            SkillFlow helps learners build technical skills through
            structured learning paths, practical resources, and
            career-focused guidance.
          </p>

          <button className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700">
            Explore Courses
          </button>
        </div>
      </section>

      {/* What is SkillFlow */}
      <section className="bg-black p-6">
        <p className="font-medium text-blue-600">
                WHAT IS SKILLFLOW?
              </p>
        <div className="mx-auto max-w-6xl text-center flex flex-col gap-8">
              <h2 className="mt-3 text-3xl font-bold">
                A clearer way to learn technology
              </h2>
              <div>
              <p className="leading-7 text-gray-600">
                SkillFlow is a learning platform designed for students,
                developers, and aspiring technology professionals.
              </p>

              <p className="mt-4 leading-7 text-gray-600">
                Instead of jumping between random tutorials and resources,
                SkillFlow helps learners understand what to learn, what
                to practice, and what to focus on next.
              </p>
              </div>
        </div>
      </section>

      {/* Problem */}
      <section className="p-6">
         <p className="font-medium text-blue-600">
            THE PROBLEM
          </p>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mt-3 text-3xl font-bold">
            Learning technology can be overwhelming.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-7 text-gray-600">
            There are thousands of courses, tutorials, technologies,
            frameworks, and career paths available online. The challenge
            isn't always finding information — it's knowing what to learn
            and where to go next.
          </p>

        </div>
      </section>

      {/* Why SkillFlow */}
      <section className="bg-black p-6">
        <p className="font-medium text-blue-600">
              WHY SKILLFLOW?
            </p>
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="mt-3 text-3xl font-bold">
              Everything you need to keep moving forward
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <FeatureCard
              title="Structured Roadmaps"
              description="Follow a clear learning path instead of randomly jumping between technologies."
            />

            <FeatureCard
              title="Curated Learning"
              description="Find useful courses and resources organized around your learning goals."
            />

            <FeatureCard
              title="Track Progress"
              description="Keep track of what you have learned and what you need to learn next."
            />

            <FeatureCard
              title="Career Focused"
              description="Build skills that help you move toward your technology career goals."
            />

          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="p-6">
         <p className="font-medium text-blue-600">
          HOW IT WORKS
            </p>
        <div className="mx-auto max-w-6xl">

          <div className="text-center">
            <h2 className="mt-3 text-3xl font-bold">
              Your learning journey
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-5">

            <Step number="01" title="Choose a Goal" />
            <Step number="02" title="Follow a Roadmap" />
            <Step number="03" title="Learn" />
            <Step number="04" title="Practice" />
            <Step number="05" title="Track Progress" />

          </div>

        </div>
      </section>

      {/* Mission */}
      <section className="p-6">
          <p className="font-medium text-blue-600">
            OUR MISSION
          </p>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Make learning technology more structured and accessible.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-7 text-gray-300">
            Our goal is to help learners spend less time wondering what
            to learn and more time actually building the skills they need.
          </p>

        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-3xl font-bold">
          Ready to start learning?
        </h2>

        <p className="mt-4 text-gray-600">
          Start building your skills with SkillFlow.
        </p>

        <button className="mt-7 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700">
          Get Started
        </button>
      </section>

    </div>
        </>
    )
}