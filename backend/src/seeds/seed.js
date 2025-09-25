require('dotenv').config();
const connectDB = require('../config/db');;
const User = require("../models/usermodel");
const Course = require("../models/coursemodel");
const bcrypt = require("bcryptjs");

    (
        async () => {
            await connectDB(process.env.MONGO_URI);

            //clean

            await User.deleteMany({});
            await Course.deleteMany({});

            const passwordhash = await bcrypt.hash("Password@123", 10);
            const newUser = User.create({
                name: "Krishna",
                email: "krishnadek2002",
                passwordHash: passwordhash,
                profile: { skills: [{ name: "HTML", level: 2 }] }
            });

            const courses = [
                {
                    "title": "HTML Basics",
                    "skills": ["HTML"],
                    "difficulty": "beginner",
                    "description": "Learn the fundamentals of HTML, including tags, elements, attributes, and how to structure a simple webpage."
                },
                {
                    "title": "CSS Fundamentals",
                    "skills": ["CSS"],
                    "difficulty": "beginner",
                    "description": "Understand the basics of CSS for styling webpages, including selectors, properties, colors, fonts, and layouts."
                },
                {
                    "title": "JavaScript for Beginners",
                    "skills": ["JavaScript"],
                    "difficulty": "beginner",
                    "description": "Get started with JavaScript by learning variables, data types, functions, loops, and DOM manipulation."
                },
                {
                    "title": "React Essentials",
                    "skills": ["React"],
                    "difficulty": "intermediate",
                    "description": "Build interactive UIs with React by learning components, props, state, hooks, and JSX basics."
                },
                {
                    "title": "Node.js & Express",
                    "skills": ["Node.js", "Backend"],
                    "difficulty": "intermediate",
                    "description": "Learn backend development using Node.js and Express, covering routing, middleware, and REST API design."
                },
                {
                    "title": "Data Structures in JS",
                    "skills": ["Algorithms"],
                    "difficulty": "intermediate"
                }
            ];

            await Course.insertMany(courses);

            console.log("Seed Completed");
            process.exit(0)
        }
    )();

