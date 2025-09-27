// src/routes/userRoutes.js
const express = require('express');
const {protect}  = require("../middlewares/authMiddleware")
const {getUsers , updateUser} = require("../controllers/usercontroller")
const { body } = require('express-validator');
const { validateRequest } = require('../validator/request_validator');

const router = express.Router();

// GET current user
router.get('/me', protect, getUsers);

// PUT update current user (basic validation)
router.put(
  '/me',
  protect,
  [
    body('name').optional().isLength({ min: 2 }).withMessage('Name min 2 chars'),
    body('email').optional().isEmail().withMessage('Invalid email'),
    body('availabilityHours').optional().isNumeric().withMessage('Availability must be number'),
    // skills can be optional; we accept array or string, so skip strict validation here
  ],
  validateRequest,
  updateUser
);

module.exports = router;
