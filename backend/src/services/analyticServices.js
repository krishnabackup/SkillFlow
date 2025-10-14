
const Enrollment = require('../models/enrollmentmodel');

async function userSummary(userId) {
  const pipeline = [
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        avgPercent: { $avg: '$progress.percent' },
        totalCourses: { $sum: 1 },
        completedCount: { $sum: { $cond: [ { $eq: ['$status', 'completed'] }, 1, 0 ] } }
      }
    }
  ];
  const [res] = await Enrollment.aggregate(pipeline).exec();
  return {
    avgPercent: res?.avgPercent || 0,
    totalCourses: res?.totalCourses || 0,
    completedCount: res?.completedCount || 0
  };
}

async function courseStats(courseId) {
  const pipeline = [
    { $match: { course: mongoose.Types.ObjectId(courseId) } },
    {
      $group: {
        _id: null,
        avgPercent: { $avg: '$progress.percent' },
        totalEnrolled: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
      }
    }
  ];
  const [res] = await Enrollment.aggregate(pipeline).exec();
  return res || { avgPercent: 0, totalEnrolled: 0, completed: 0 };
}


async function courseDistribution(courseId) {
  const pipeline = [
    { $match: { course: mongoose.Types.ObjectId(courseId) } },
    {
      $bucket: {
        groupBy: '$progress.percent',
        boundaries: [0, 25, 50, 75, 100, 101],
        default: 'unknown',
        output: {
          count: { $sum: 1 },
          avg: { $avg: '$progress.percent' }
        }
      }
    }
  ];
  return Enrollment.aggregate(pipeline).exec();
}
