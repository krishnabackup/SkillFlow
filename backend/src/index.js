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
const emailVerificationRoutes = require('./routes/emailverification');
const passwordResetRoutes = require('./routes/passwordRestRoute');
const analyticsRoutes = require("./routes/analyticsRoute")
const app = express()


//Middleware
app.use(helmet())
app.use(express.json())
app.use(cors({origin: [process.env.CLIENT_URI,'http://192.168.18.8:5173'], credentials: true}))
app.use(morgan('dev'))
//auth route
app.use('/api/auth', authRoutes);
app.use('/api/users',userRoutes)
app.use("/api/admin",adminRoutes);
app.use("/api/courses",courseRoutes);
app.use('/api/auth/email-verification', emailVerificationRoutes);
app.use('/api/auth', passwordResetRoutes);

//analytics route
app.use("/api/admin/analytics",analyticsRoutes)

//health 

app.use('/api/health' , (req,res) => res.json({staus : "ok"}))

//error handler
app.use(errorHandler)

module.exports = app;
const PORT = process.env.PORT || 5000
connectDB(process.env.MONGO_URI).then(() => {
    app.listen(PORT,"0.0.0.0", () => {
        console.log(`Server running on ${PORT}`)
    })
}).catch((err) => {
    console.log(err)
}
)

