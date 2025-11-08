require("dotenv").config();
const {GoogleGenAI} = require("@google/genai");
const  PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");;
const {cleanQuizData } = require("../utils/aijsonparser");
const Courses = require("../models/coursemodel");
const Users = require("../models/usermodel");
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY)
const CertifcateModel = require("../models/CertificateModel");
const { compareSync } = require("bcryptjs");
const generateCertificateBuffer = require("../utils/generatePdfBuffer");
const generateQuiz = async (req,res) => {
    try {
        const course =await  Courses.findById(req.params.id);
        if(!course) return res.status(404).json({message : "Course not Found"});
        const topic = course.title;
        const numQuestion = 10;
        const systemPrompt = `You are a quiz master , your job is to generate a multiple choice question of users's selected course.Options should be an array of 4 different option labeled as (A-D) .Return the results as proper JSON format as mentioned : 
  {
   "question" : string,
   "options" : [String],
   "correct_answer" : string 
  }
  `
  const prompt = `Generate ${numQuestion} multiple choice question on ${topic} at varying difficulty level question , options (A-D)`
  const  result = await ai.models.generateContent({
    model : "gemini-2.5-flash",
    contents : prompt,
    config : {
        systemInstruction : systemPrompt
    }
  });
  const quiz = cleanQuizData(result.text);
  res.json({sucess : true , quiz : quiz });
    }
    catch(error) {
        console.log(error);
        res.status(400).json({sucees : false , error : "Quiz generate Error"});
    }
};

const submitQuiz = async(req,res) => {
 try {
   const {score} = req.body;
    const courseId = req.params.id; 
    const userId = req.user.id;
    const course =await  Courses.findById(courseId);
    if(!course) return res.status(404).json({message : "Course not Found"});
    const courseTitle = course.title;
    const user = await  Users.findById(userId);
    if(!user) return res.status(404).json({message : "User not Found"});
    const userName  = user.name;
   const percentage = (score / 10) * 100 ;
   if(percentage >= 60) {
     const pdfBuffer = await generateCertificateBuffer(userName,courseTitle,percentage);
     const certficates = await CertifcateModel.create({
      userId,
      userName,
      courseId,
      courseTitle,
      certificate : pdfBuffer
     });
     await certficates.save();

     return res.status(200).json({
      passed : true,
      userName : userName,
      courseTitle : courseTitle,
      percentage : percentage
     });
   }
else {
  return res.status(201).json({
    passed: false,
    message: "You did not meet the passing Criteria (60%)",
  });
}
  }
 catch(error) {
    console.error(error);
    res.status(500).json({error : "Error Sumbmiting the Quiz"})
 }
}

const downloadPdf = async(req,res) => {
  try {
    const cert = await CertifcateModel.findById(req.params.id);
    if (!cert) return res.status(404).json({ message: "Certificate not found" });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="certificate_${cert._id}.pdf"`,
    });

    res.send(cert.certificate);
    }
  catch(error) {
    console.error(error);
    res.status(500).json({message : "Error Submitting the Quiz"})
  }
}

const getAllCertificates = async(req,res) => {
  try {
  const userId = req.user.id;
  const certficates  = await CertifcateModel.find({userId})
  if(!certficates) return res.json({message : "No Certificates Founded" , found : false})
  res.json(certficates)
  }
  catch(error) {
    console.error("Error occured : ",error);
  }
   
}
module.exports = {generateQuiz , submitQuiz , downloadPdf ,getAllCertificates};




