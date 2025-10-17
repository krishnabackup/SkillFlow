require('dotenv').config();
const connectDB = require('../config/db');;
const User = require("../models/usermodel");
const Course = require("../models/coursemodel");
const bcrypt = require("bcryptjs");

    (
        async () => {
            await connectDB(process.env.MONGO_URI);

            const passwordhash = await bcrypt.hash("Password@123", 10);
            const newUser = await User.create({
                name: "Krishna",
                email: "krishnadek2006@gmail.com",
                role: "admin",
                passwordHash: passwordhash,
            });
            console.log("Seed Completed");
            process.exit(0)
        }
    )();

