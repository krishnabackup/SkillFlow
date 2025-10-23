const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();
const Users = require("../models/usermodel")
const bcrypt = require("bcryptjs")

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

router.post('/password-reset/request-reset', async (req, res) => {
    try {
        const { email } = req.body;
       const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
       const verificationLink = `http://localhost:5173/forgetPassword?token=${token}`;

       await transporter.sendMail({
        to: email,
        subject: 'Password Reset Request',
        html: `<p>Please Reset Password by clicking here <a href="${verificationLink}">here</a></p>`,
       });
       res.status(200).json({ message: 'Verification email sent' });
    }
    catch (error) {
        console.error('Error sending verification email:', error);
        res.status(500).json({ message: 'Failed to send verification email' });
    }
});

router.get('/forgetPassword', (req, res) => {
    const { token } = req.query;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ message: 'Email verified successfully', email: decoded.email });
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});

router.post('/forgetPassword', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const salt = await bcrypt.genSalt(10);
        const isPasswordSame = await bcrypt.compare(newPassword, user.passwordHash);
        if(isPasswordSame){
            return  res.status(400).json({ message: 'New password must be different from the old password' });
        }
        const newpasswordHash = await bcrypt.hash(newPassword, salt);
        user.passwordHash = newpasswordHash;
        await user.save();
        res.status(200).json({ message: 'Password reset successfully for'});
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});

module.exports = router;