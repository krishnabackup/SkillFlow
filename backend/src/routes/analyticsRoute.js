const express = require("express")
const { protect } = require("../middlewares/authMiddleware")
const { authorize } = require("../middlewares/authorization_middlewarw")
const { getAnalytics, dailyEnrollments, topCourses } = require("../controllers/analyticsController")
const router = express.Router()


router.get("/summary",protect,authorize("admin"),getAnalytics)
router.get("/enrollments",protect,authorize("admin"),dailyEnrollments)
router.get("/top-courses",protect,authorize("admin"),topCourses)

module.exports = router