const express = require("express");
const router  = express.Router();
const {createCourseValidator,updateCourseValidator} = require("../validator/course_validator");
const coursController = require("../controllers/coursecontroller")
const {protect} = require("../middlewares/authMiddleware");
const {authorize} = require("../middlewares/authorization_middlewarw");
const { validateRequest } = require('../validator/request_validator');
const { generateQuiz, submitQuiz } = require("../controllers/quizController");



router.get("/",coursController.getCourses);
router.get("/:id",coursController.getCourseById);
router.post("/",protect,authorize("admin"),createCourseValidator,validateRequest,coursController.createCourse)
router.put("/:id",protect,authorize("admin"),updateCourseValidator,validateRequest,coursController.updateCourse);
router.delete("/:id",protect,authorize("admin"),coursController.deleteCourse);

//quiz for courses 

router.get("/:id/quiz",generateQuiz);

router.post("/:id/quiz/submit",protect,submitQuiz);

module.exports = router;