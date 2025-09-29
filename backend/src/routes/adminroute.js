const express = require("express")
const router = express.Router()
const {protect}  =require("../middlewares/authMiddleware")
const {authorize} = require("../middlewares/authorization_middlewarw")
const User = require("../models/usermodel")

router.get("/users",protect,authorize('admin'),async (req,res) => {
    const users = await User.find().select("-passwordHash");
    res.json(users);
}) 

router.put("/users/:id/role",protect,authorize('admin'), async (req,res) => {
    const {role} = req.body;
    if(!role) return res.status(400).json({message : "Role is required"})
    
  const allowed = ['learner', 'admin'];
  if (!allowed.includes(role)) return res.status(400).json({ message: 'invalid role' });
  
  const user = await User.findByIdAndUpdate(req.params.id, {role, $unset : {profile : ""}} , {new : true}).select("-passwordHash");
  if(!user) return res.status(404).json({message : "User Not found"})
  res.json(user)
});

module.exports = router

