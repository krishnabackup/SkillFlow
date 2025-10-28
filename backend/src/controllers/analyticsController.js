const asynchandler = require("../utils/asynchandler")
const Enrollments = require("../models/enrollmentmodel")
const Course = require("../models/coursemodel")
const Users = require("../models/usermodel")

const getAnalytics = asynchandler(async(req,res,next) => {
   const totalCourses = await Course.countDocuments()
   const totalUsers = await Users.countDocuments()
   const totalEnrollments = await Enrollments.countDocuments();
   const activeUsers = await Enrollments.distinct('user', { lastActivity: { $gte: new Date(Date.now() - 30*24*3600*1000) } }).then(a=>a.length);
   const courseTotals = await Enrollments.aggregate([
    { $lookup: { from: 'courses', localField: 'course', foreignField: '_id', as: 'course' } },
    { $unwind: '$course' },
    { $addFields: {
        totalLessons: { $sum: { $map: { input: '$course.modules', as: 'm', in: { $size: { $ifNull: ['$$m.lessons', []] } } } } }
      }},
    { $project: {
        percent: {
          $cond: [{ $gt: ['$totalLessons', 0] }, { $multiply: [{ $divide: ['$completedCount', '$totalLessons'] }, 100] }, 0]
        }
      }},
    { $group: { _id: null, avgPercent: { $avg: '$percent' } } }
  ]);
  const avgCompletion = courseTotals[0]?.avgPercent || 0;
  const coursesCount = await Course.countDocuments();

  res.json({ totalUsers, activeUsers, totalEnrollments, avgCompletion: Math.round(avgCompletion*100)/100, coursesCount });
}) 

const topCourses = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const top = await Enrollments.aggregate([
      { $group: { _id: "$course", enrollments: { $sum: 1 }, avgCompleted: { $avg: "$completedCount" } } },
      { $lookup: { from: "courses", localField: "_id", foreignField: "_id", as: "course" } },
      { $unwind: "$course" },
      {
        $project: {
          courseId: "$_id",
          title: "$course.title",
          enrollments: 1,
          avgCompleted: 1,
          totalLessons: { $sum: { $map: { input: "$course.modules", as: "m", in: { $size: { $ifNull: ["$$m.lessons", []] } } } } },
        },
      },
      {
        $addFields: {
          avgCompletionPercent: {
            $cond: [
              { $gt: ["$totalLessons", 0] },
              { $multiply: [{ $divide: ["$avgCompleted", "$totalLessons"] }, 100] },
              0,
            ],
          },
        },
      },
      { $sort: { enrollments: -1 } },
      { $limit: limit },
    ]);
    res.json(top);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching top courses" });
  }
};

const dailyEnrollments = async (req, res) => {
  try {
    const days = Number(req.query.range || 30);
    const since = new Date(Date.now() - days * 24 * 3600 * 1000);

    const series = await Enrollments.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        }
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(series);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching enrollment trends" });
  }
};

module.exports = {getAnalytics,dailyEnrollments,topCourses}