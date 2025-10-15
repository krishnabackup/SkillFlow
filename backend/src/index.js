require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authroute');
const { errorHandler } = require('./middlewares/errorhandler');
const userRoutes = require('./routes/userroute')
const adminRoutes = require("./routes/adminroute")
const courseRoutes  = require("./routes/courseroute");
const app = express()


const PORT = process.env.PORT || 5000

connectDB(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`)
    })
})

