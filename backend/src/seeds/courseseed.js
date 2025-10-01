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
  { title: "Cloud Fundamentals", skills:["Cloud"], difficulty:"beginner", description:"Intro to cloud." },
    { title: "Advanced CSS", skills:["CSS","Design"], difficulty:"intermediate", description:"Flexbox, Grid, animations." },
  { title: "TypeScript Essentials", skills:["TypeScript"], difficulty:"intermediate", description:"Strongly typed JS development." },
  { title: "React Advanced Patterns", skills:["React"], difficulty:"advanced", description:"Context, HOCs, render props." },
  { title: "Next.js Fundamentals", skills:["Next.js","React"], difficulty:"intermediate", description:"SSR and static site generation." },
  { title: "GraphQL with Node.js", skills:["GraphQL","Node.js"], difficulty:"intermediate", description:"Build GraphQL APIs." },
  { title: "Docker Basics", skills:["Docker"], difficulty:"beginner", description:"Containers and Docker CLI." },
  { title: "Kubernetes Essentials", skills:["Kubernetes","DevOps"], difficulty:"intermediate", description:"Cluster orchestration." },
  { title: "Linux for Developers", skills:["Linux"], difficulty:"beginner", description:"Essential commands and scripting." },
  { title: "Git & GitHub Mastery", skills:["Git","Version Control"], difficulty:"beginner", description:"Collaboration with Git." },
  { title: "REST API Design", skills:["Backend","API"], difficulty:"intermediate", description:"Principles of REST APIs." },

  { title: "MongoDB Essentials", skills:["MongoDB","Database"], difficulty:"beginner", description:"CRUD operations in MongoDB." },
  { title: "PostgreSQL Advanced", skills:["PostgreSQL"], difficulty:"advanced", description:"Stored procedures & triggers." },
  { title: "Tailwind CSS Basics", skills:["CSS","Tailwind"], difficulty:"beginner", description:"Utility-first styling." },
  { title: "Bootstrap Fundamentals", skills:["Bootstrap"], difficulty:"beginner", description:"Build responsive layouts." },
  { title: "Vue.js Basics", skills:["Vue.js"], difficulty:"beginner", description:"Getting started with Vue." },
  { title: "Angular Fundamentals", skills:["Angular"], difficulty:"intermediate", description:"Components, services, routing." },
  { title: "C Programming Basics", skills:["C"], difficulty:"beginner", description:"Intro to C programming." },
  { title: "C++ OOP Concepts", skills:["C++"], difficulty:"intermediate", description:"Classes, inheritance, polymorphism." },
  { title: "Java Essentials", skills:["Java"], difficulty:"beginner", description:"OOP in Java." },
  { title: "Spring Boot Fundamentals", skills:["Java","Spring"], difficulty:"intermediate", description:"REST APIs with Spring Boot." },

  { title: "Android Development Basics", skills:["Android","Java"], difficulty:"beginner", description:"Build Android apps." },
  { title: "iOS Development with Swift", skills:["Swift","iOS"], difficulty:"intermediate", description:"iOS apps with Swift." },
  { title: "Flutter for Beginners", skills:["Flutter","Dart"], difficulty:"beginner", description:"Cross-platform mobile apps." },
  { title: "React Native Basics", skills:["React Native"], difficulty:"beginner", description:"Mobile apps with React Native." },
  { title: "Cybersecurity Fundamentals", skills:["Security"], difficulty:"beginner", description:"Intro to cybersecurity." },
  { title: "Ethical Hacking Basics", skills:["Hacking","Security"], difficulty:"intermediate", description:"Penetration testing concepts." },
  { title: "DevOps Essentials", skills:["DevOps","CI/CD"], difficulty:"intermediate", description:"CI/CD pipelines, automation." },
  { title: "AWS Cloud Practitioner", skills:["AWS","Cloud"], difficulty:"beginner", description:"AWS services basics." },
  { title: "Azure Fundamentals", skills:["Azure","Cloud"], difficulty:"beginner", description:"Azure core concepts." },
  { title: "GCP Essentials", skills:["GCP","Cloud"], difficulty:"beginner", description:"Google Cloud basics." },

  { title: "Data Science with R", skills:["R","Data Science"], difficulty:"intermediate", description:"Data analysis with R." },
  { title: "Deep Learning with TensorFlow", skills:["Deep Learning","TensorFlow"], difficulty:"advanced", description:"Neural networks in TF." },
  { title: "Natural Language Processing", skills:["NLP","ML"], difficulty:"advanced", description:"Text classification, sentiment analysis." },
  { title: "Big Data with Hadoop", skills:["Big Data","Hadoop"], difficulty:"intermediate", description:"MapReduce and HDFS." },
  { title: "Spark for Data Engineers", skills:["Apache Spark"], difficulty:"intermediate", description:"Data processing with Spark." },
  { title: "Power BI Basics", skills:["Power BI","Analytics"], difficulty:"beginner", description:"Data visualization with Power BI." },
  { title: "Tableau for Beginners", skills:["Tableau","Analytics"], difficulty:"beginner", description:"Create dashboards in Tableau." },
  { title: "Excel for Data Analysis", skills:["Excel"], difficulty:"beginner", description:"Formulas, charts, pivot tables." },
  { title: "Project Management Basics", skills:["Project Management"], difficulty:"beginner", description:"Agile & Scrum concepts." },
  { title: "Software Testing Fundamentals", skills:["Testing","QA"], difficulty:"beginner", description:"Manual and automation testing." },
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