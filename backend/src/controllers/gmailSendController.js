const asynchandler = require("../utils/asynchandler");
const sendEmail = require("../services/gmail_servies")
const gmailSendVerification = asynchandler(async(req,res) => {
           const { email } = req.body;
            const from = process.env.EMAIL_USER ?? 'krishnadek2002@gmail.com'
            const API = process.env.CLIENT_URI ?? 'http:localhost:5173'
            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }
            const existingUser = await Users.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists' });
            }
            const content = `<h2>Welcome to SkillFlow</h2>

        <p>
          Please verify your email address to continue.
        </p>

        <a href="${verificationLink}">
          Verify Email
        </a>

        <p>This link expires in 1 hour.</p>`
           const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
           const verificationLink = `${API}/verify-email?token=${token}`;
           const {data} = await sendEmail({
           to : email,
           subject : "Email Verifiction for Logging inn to SKILLFLOW WEBSITE",
           html : content 
           })
           res.status(200).json({ message: 'Verification email sent' });
})

module.exports = {gmailSendVerification}