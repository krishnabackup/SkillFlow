const express = require("express")
const router = express.Router()
const {protect}  =require("../middlewares/authMiddleware")
const {authorize} = require("../middlewares/authorization_middlewarw")
const User = require("../models/usermodel")
const asynchandler = require("../utils/asynchandler")
const {getAnalytics} = require("../controllers/analyticsController")
router.get("/users",protect,authorize('admin'), asynchandler(async (req,res) => {
      const { page = 1, limit = 10, q, sortBy = 'createdAt', order = 'desc' } = req.query;
      const skip = (Number(page) - 1 ) * Number(limit);

      //filter
      const filter = {};
      if(q) {
        filter.$text = {$search : q}
      }

  const sort = {};
  sort[sortBy] = order === 'asc' ? 1 : -1;

  const [items, total] = await Promise.all([
    User.find(filter).sort(sort).skip(skip).limit(Number(limit)),
    User.countDocuments(filter)
  ]);

  res.json({
    page: Number(page),
    limit: Number(limit),
    total,
    items
  });
}))


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

