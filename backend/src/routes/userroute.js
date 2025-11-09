// src/routes/userRoutes.js
const express = require('express');
const {protect}  = require("../middlewares/authMiddleware")
const {getUsers , updateUser} = require("../controllers/usercontroller")
const { body } = require('express-validator');
const { validateRequest } = require('../validator/request_validator');
const Users = require("../models/usermodel");
const { normalizeSkills } = require('../middlewares/normalizeSkills');
const Course = require("../models/coursemodel");
const Enrollments = require("../models/enrollmentmodel")
const router = express.Router();
const {getRecommendation} = require("../controllers/recommendation_controller");
const {getRoadmap: getRoadmapOpenAI, generateRoadmap: generateRoadmapOpenAI} = require('../services/openaiservices_openai');
const {generateRoadmap,getRoadmap, getRoadmapById} = require('../services/openaiservices');
const { generateRoadmapGoogle, getRoadmapGoogle, getRoadmapByIdGoogle, deleteRoadmapByIdGoogle } = require('../services/geminiapi');
const { getAllCertificates } = require('../controllers/quizController');
const { getProgress , updateProgress } = require('../controllers/progressControler');
router.get('/me', protect, getUsers);

router.put(
  '/me',
  protect,
  [
    body('name').optional().isLength({ min: 2 }).withMessage('Name min 2 chars'),
    body('email').optional().isEmail().withMessage('Invalid email'),
    body('availabilityHours').optional().isNumeric().withMessage('Availability must be number'),
    
  ],
  normalizeSkills,
  validateRequest,
  updateUser
);

router.get("/me/enrollments",protect,async(req,res)=>{
  const user = await Users.findOne(req.user.id)
  .select('profile.enrollments')
  .populate('profile.enrollments.course','title description difficulty skills estimatedHours');
  res.json(user.profile.enrollments);
});

router.post("/me/enrollments",protect,async(req,res)=>{
  const {courseId} = req.body;
  console.log(req.body)
  if(!courseId) return res.status(400).json({message : "CourseId required"});
 

  const already = await Users.findOne({_id : req.user.id, 'profile.enrollments.course' : courseId});
  if(already) return res.status(402).json({message  : "Already Existed Course"});

  const enrollments = { course : courseId , enrolledAt : Date.now()}
  await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentsCount : 1 } });
  const user = await Users.findByIdAndUpdate(req.user.id,{$push: { 'profile.enrollments' : enrollments } }, {new : true })
  .populate('profile.enrollments.course','title description difficulty skills estimatedHours')
  res.status(201).json(user.profile.enrollments);
  await Enrollments.insertOne({
    user : req.user.id,
    course : courseId,
     status : 'active'
  })
})


// DELETE unenroll
router.delete('/me/enrollments/:courseId', protect, async (req, res) => {
  const { courseId } = req.params;
  const user = await Users.findByIdAndUpdate(req.user.id, { $pull: { 'profile.enrollments': { course: courseId } } }, { new: true });
  const enrol = await Enrollments.findOneAndDelete({user : req.user.id ,course : courseId})
  console.log(enrol)
  res.json({ message: 'Unenrolled', enrollments: user.profile.enrollments });
});


router.get('/me/recommendation', protect, getRecommendation);

//Roadmap Routes
router.post('/me/roadmap',protect,generateRoadmapGoogle)
router.get('/me/roadmap',protect,getRoadmapGoogle)
router.get('/me/roadmap/:id',protect,getRoadmapByIdGoogle);
router.delete('/me/roadmap/:id',protect,deleteRoadmapByIdGoogle)

//enrollment Route
router.get('/me/enrollments/progress/:courseId', protect, getProgress);

router.patch("/me/enrollments/progress",protect,updateProgress)

//certificates 

router.get('/me/certficates',protect,getAllCertificates);

module.exports = router;
