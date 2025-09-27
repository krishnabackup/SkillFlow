require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authroute');
const { errorHandler } = require('./middlewares/errorhandler');
const userRoutes = require('./routes/userroute')

const app = express()

//Middleware
app.use(helmet())
app.use(express.json())
app.use(cors({origin: 'http://localhost:5173', credentials: true}))
app.use(morgan('dev'))

//auth route
app.use('/api/auth', authRoutes);
app.use('/api/users',userRoutes)

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