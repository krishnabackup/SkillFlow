require("dotenv").config();
const User = require("../models/usermodel");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");

(
    async () => {
        await connectDB(process.env.MONGO_URI)
        const email = "krishnadek2006@gmail.com";
        const exits  = await User.findOne({email});
        if(exits) return console.log("Admin exits");
        const passwordHash = await bcrypt.hash("Password@123",10);
    const learnerUsers = [
    {
        name: "Ammus",
        email: "ammus@gmail.com",
        passwordHash: passwordHash,
    },
    {
        name: "Rahul",
        email: "rahul2000@gmail.com",
        passwordHash: passwordHash,
    },
    {
        name: "Meera",
        email: "meera123@gmail.com",
        passwordHash: passwordHash,
    },
    {
        name: "Vishnu",
        email: "vishnu.ps@gmail.com",
        passwordHash: passwordHash,
    },
    {
        name: "Devika",
        email: "devika.mb@gmail.com",
        passwordHash: passwordHash,
    },
    {
        name: "Anu",
        email: "anu.suresh@gmail.com",
        passwordHash: passwordHash,
    },
];

        await User.insertMany(learnerUsers);
        console.log("Admin created ", email);
        process.exit(0);
    }
)();

