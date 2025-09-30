const Courses = require("../models/coursemodel");
const asynchandler = require("../utils/asynchandler");


const createCourse =  asynchandler(async (req,res) => {
   const payload = req.body;
   if(req.user) payload.createBy = req.user.id;
   const course = await Courses.create(payload);
   res.status(201).json(course);
});

const getCourses = asynchandler(async (req,res) => {
      const { page = 1, limit = 10, q, skill, difficulty, sortBy = 'createdAt', order = 'desc' } = req.query;
      const skip = (Number(page) - 1 ) * Number(limit);

      //filter
      const filter = {};
      if(q) {
        filter.$text = {$search : q}
      }
        if (skill) {
    // support multiple skills comma separated
    const skills = String(skill).split(',').map(s => s.trim()).filter(Boolean);
    if (skills.length) filter.skills = { $in: skills };
  }
  if (difficulty) filter.difficulty = difficulty;

  const sort = {};
  sort[sortBy] = order === 'asc' ? 1 : -1;

  const [items, total] = await Promise.all([
    Courses.find(filter).sort(sort).skip(skip).limit(Number(limit)),
    Courses.countDocuments(filter)
  ]);

  res.json({
    page: Number(page),
    limit: Number(limit),
    total,
    items
  });
})

const getCourseById = asynchandler(async (req,res) => {
    const course =await  Courses.findById(req.params.id);
    if(!course) return res.status(404).json({message : "Course not Found"});
    res.json(course);
});

const updateCourse = asynchandler(async (req,res) => {
    const update = req.body;
    update.updatedAt  = Date.now();
    const course = await Courses.findByIdAndUpdate(req.params.id, {$set : update},{new : true , runValidators : true});
    if(!course) return res.status(404).json({message : "Course not found"});
    res.status(200).json(course);
});

const deleteCourse = asynchandler(async (req,res) => {
 const course = await Courses.findByIdAndDelete(req.params.id);
 if(!course) return res.status(404).json({message : "Delete unccessful"});
res.status(200).json({message : "Delete Sucessfully completed"});
});


module.exports = {getCourseById,getCourses,deleteCourse,createCourse,updateCourse}