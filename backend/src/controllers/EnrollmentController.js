const { upsertProgress } = require('../services/EnrollmentServices');

const updateProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;
    const { percent, lessonId, status } = req.body;
    const enrollment = await upsertProgress(userId, courseId, { percent, lessonId, status });
    res.json({ success: true, enrollment });
  } catch (err) {
    next(err);
  }
};

module.exports = {updateProgress}