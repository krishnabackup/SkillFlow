const { body } = require('express-validator');

const createCourseValidator = [
  body('title').notEmpty().withMessage('Title is required').isLength({ min: 3 }),
  body('description').optional().isString(),
  body('difficulty').optional().isIn(['beginner','intermediate','advanced']),
  body('skills').optional().isArray(),
  body('estimatedHours').optional().isNumeric().toInt(),
];

const updateCourseValidator = [
  body('title').optional().isLength({ min: 3 }),
  body('difficulty').optional().isIn(['beginner','intermediate','advanced']),
  body('skills').optional().isArray(),
  body('estimatedHours').optional().isNumeric().toInt(),
];

module.exports = {createCourseValidator,updateCourseValidator}