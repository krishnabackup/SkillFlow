const express = require("express")
const {login,register,getProfile,restPasswordRequest} = require("../controllers/authcontroller")
const { protect } = require("../middlewares/authMiddleware")
const {registerValidator,loginValidator} = require("../validator/auth_validator")
const {validateRequest} = require("../validator/request_validator")
const { rest } = require("lodash")
const router  = express.Router()

router.post("/register",registerValidator,validateRequest,register)
router.post("/login",loginValidator,validateRequest,login)
router.get("/getme",protect,getProfile)


module.exports = router