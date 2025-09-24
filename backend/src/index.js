require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authroute');
const { errorHandler } = require('./middlewares/errorhandler');

const app = express()

//Middleware
app.use(helmet())
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

//auth route
app.use('/api/auth', authRoutes);

//health 

app.use('/api/health' , (req,res) => res.json({staus : "ok"}))

//error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000

connectDB(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`)
    })
})