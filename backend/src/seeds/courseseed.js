require("dotenv").config();
const Courses = require("../models/coursemodel");
const sample = require("../../data/courses_seed");
const connectDB = require("../config/db");

(
    async() => {
        try{
        await connectDB(process.env.MONGO_URI);
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