
const Enrollment = require('../models/enrollmentmodel');

async function upsertProgress(userId, courseId, { percent, lessonId, status }) {
  const update = { 
    'progress.updatedAt': new Date()
  };

  if (typeof percent === 'number') {
    update['progress.percent'] = Math.max(0, Math.min(100, percent));
    if (update['progress.percent'] === 100) {
      update.completedAt = new Date();
      update.status = 'completed';
    } else {
      update.status = 'active';
    }
  }

  if (lessonId && status) {
    // upsert or update progress.items element - use $set with positional operator if exists
    // simplest: push new item or replace existing item by lessonId
    // We'll use findOne then update in-memory for clarity (atomic alternatives exist).
    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (enrollment) {
      const idx = (enrollment.progress.items || []).findIndex(i => i.lessonId === lessonId);
      if (idx >= 0) {
        enrollment.progress.items[idx].status = status;
        enrollment.progress.items[idx].completedAt = status === 'completed' ? new Date() : null;
      } else {
        enrollment.progress.items.push({
          lessonId,
          status,
          completedAt: status === 'completed' ? new Date() : null
        });
      }
      if (typeof percent === 'number') enrollment.progress.percent = update['progress.percent'];
      enrollment.progress.updatedAt = update['progress.updatedAt'];
      if (enrollment.progress.percent === 100) {
        enrollment.completedAt = new Date();
        enrollment.status = 'completed';
      }
      await enrollment.save();
      return enrollment;
    } else {
      // create
      const newE = new Enrollment({
        user: userId,
        course: courseId,
        progress: {
          percent: percent || 0,
          items: [{ lessonId, status, completedAt: status === 'completed' ? new Date() : null }],
          updatedAt: new Date()
        },
        status: percent === 100 ? 'completed' : 'active',
        completedAt: percent === 100 ? new Date() : null
      });
      await newE.save();
      return newE;
    }
  } else {
    // percent only
    const enrollment = await Enrollment.findOneAndUpdate(
      { user: userId, course: courseId },
      { $set: update },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return enrollment;
  }
}

module.exports = { upsertProgress };
