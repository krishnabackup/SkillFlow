require("dotenv").config();
const Courses = require("../models/coursemodel");
const connectDB = require("../config/db");
const sample = [
  { title: "HTML Basics", skills:["HTML"], difficulty:"beginner", description:"Learn the fundamentals of HTML." },
  { title: "CSS Fundamentals", skills:["CSS"], difficulty:"beginner", description:"Learn CSS basics." },
  { title: "JavaScript for Beginners", skills:["JavaScript"], difficulty:"beginner", description:"JS fundamentals." },
  { title: "React Essentials", skills:["React"], difficulty:"intermediate", description:"React components & hooks." },
  { title: "Node.js & Express", skills:["Node.js","Backend"], difficulty:"intermediate", description:"Build REST APIs." },
  { title: "Data Structures in JS", skills:["Algorithms"], difficulty:"intermediate", description:"Common data structures." },
  { title: "Python for Data Science", skills:["Python"], difficulty:"beginner", description:"NumPy, Pandas basics." },
  { title: "Intro to Machine Learning", skills:["ML"], difficulty:"intermediate", description:"ML principles." },
  { title: "SQL for Developers", skills:["SQL"], difficulty:"beginner", description:"SQL queries & joins." },
  { title: "Cloud Fundamentals", skills:["Cloud"], difficulty:"beginner", description:"Intro to cloud." }
];

(
    async() => {
        try{
        await connectDB(process.env.MONGO_URI);
        await Courses.deleteMany({});
        await Courses.insertMany(sample);
        console.log("Seed Completed");
        }
        catch(eror) {
            console.log(eror);
        }
        finally{
         process.exit(0);
        }
    }
)();