const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const express = require('express');
const app = express();
const Users = require('../models/usermodel');





app.post('/send-verification-email', async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP ERROR:", error);
  } else {
    console.log("SMTP READY:", success);
  }
});
        const { email } = req.body;
        const API = process.env.CLIENT_URI ?? 'http://localhost:5173'
        console.log(API)
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
       const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
       const verificationLink = `${API}/verify-email?token=${token}`;
       console.log(verificationLink)
       const result = await transporter.sendMail({
        to: email,
        subject: 'Email Verification',
        html: `<p>Please verify your email by clicking <a href="${verificationLink}">here</a></p>`,
       });
       console.log(result)
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
