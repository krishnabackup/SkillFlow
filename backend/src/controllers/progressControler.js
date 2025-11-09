const enrollmentmodel = require("../models/enrollmentmodel");
const asynchandler = require("../utils/asynchandler");

const updateProgress = async(req,res) => {
  try {
    const {courseId,progress , lastTime} = req.body;
    const userId = req.user.id
     const progressEntry = {
      status: progress >= 99 ? "completed" : "in_progress",
      progress,
      completedAt: progress >= 99 ? new Date() : null,
      lastTime
    };
    const update = await enrollmentmodel.updateOne({ user: userId, course: courseId },
  {
    $set: {
      lastActivity: new Date(),
      status: progress === 100 ? "completed" : "active",
    },
    $push: {
      progress: {
        status: progress === 100 ? "completed" : "in_progress",
        progressPercent: progress,
        completedAt: progress === 100 ? new Date() : null,
        meta: { lastTime },
      },
    },
  },
  { upsert: false }
    );
    if (!update) {
      await Enrollment.findOneAndUpdate(
        { user: userId, course: courseId },
        {
          $push: { progress: progressEntry },
          $set: { lastActivity: new Date() },
        },
        { new: true, upsert: true }
      );
    }
    res.status(201).json({success : true , update});
  }
  catch(error) {
    console.error("Error : ",error);
    res.status(500).json("Error updating progress")
  }
}

const getProgress = asynchandler(async(req,res) => {
    const {courseId} = req.params;
    const userId = req.user.id;
    console.log(userId,courseId)
    const data = await enrollmentmodel.findOne({user : userId, course : courseId});
    if(!data) return res.status(404).json({ message : "Enrollment not found"});

    res.json(data)
})

module.exports = {updateProgress,getProgress}