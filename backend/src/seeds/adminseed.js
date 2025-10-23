require("dotenv").config();
const User = require("../models/usermodel");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");

(
    async () => {
        await connectDB(process.env.MONGO_URI)
        const email = "krishnadek2002@gmail.com";
        const exits  = await User.findOne({email});
        if(exits) return console.log("Admin exits");
        const passwordHash = await bcrypt.hash("Password@123",10);
        const adminUser = {
            name : "Admin",
            role : "admin",
            email,
            passwordHash,
        }
        await User.insertOne(adminUser);
        console.log("Admin created ", email);
        process.exit(0);
    }
)();

