const express = require("express")
const { gmailSendVerification } = require("../controllers/gmailSendController")
const router = express.Router()

router.post("/send-verification-email",gmailSendVerification)

module.exports = router

