const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const express = require('express');
const app = express();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.post('/send-verification-email', async (req, res) => {
    try {
       const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
       const verificationLink = `http://localhost:5173/verify-email?token=${token}`;

       await transporter.sendMail({
        to: email,
        subject: 'Email Verification',
        html: `<p>Please verify your email by clicking <a href="${verificationLink}">here</a></p>`,
       });
       res.status(200).json({ message: 'Verification email sent' });
    }
    catch (error) {
        console.error('Error sending verification email:', error);
        res.status(500).json({ message: 'Failed to send verification email' });
    }
});

app.get('/verify-email', (req, res) => {
    const { token } = req.query;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ message: 'Email verified successfully', email: decoded.email });
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});

module.exports = app;
