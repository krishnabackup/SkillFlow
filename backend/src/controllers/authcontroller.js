const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Users = require("../models/usermodel")
const asynchandler = require("../utils/asynchandler")

const jwtSecret = process.env.JWT_SECRET || 'changeme';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

const register = asynchandler(async (req,res) => {
    const {name, email , password} = req.body;
    if(!name || !email || !password) {
        return res.status(400).json({message : "Name,Email or Password required"});
    }
    const existing = await Users.findOne({email})
    if(existing) return res.status(400).json({message : "Email already exists "})

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = new Users({name,email,passwordHash});
  await user.save();

  const token = jwt.sign({id : user._id, role: user.role}, jwtSecret, {expiresIn: jwtExpiresIn})

  res.status(201).json({token, user: { id: user._id, name: user.name, email: user.email, role: user.role }})
});

const login = asynchandler(async (req,res) => {
    const {email, password} = req.body
    if(!email || !password) {
        return res.status(400).json({message : "Email or Password is Mandatory"})
    }
    const user = await Users.findOne({email})
    if(!user) return res.status(401).json({message : "Invalid Credentials"})

    const isMatch = await bcrypt.compare(password,user.passwordHash)
    if(!isMatch) return res.status(401).json({message : "Invalid Password"})
    const token = jwt.sign({id : user._id, role: user.role}, jwtSecret, {expiresIn: jwtExpiresIn})
    res.status(201).json({token, user: { id: user._id, name: user.name, email: user.email, role: user.role }})
});

const getProfile = asynchandler(async (req,res) => {
    const user = await Users.findById(req.user.id).select('-passwordHash');
    if(!user) return res.status(401).json({message : "User not Found"});
    res.json(user)
});

module.exports = { login , register , getProfile }
