require("dotenv").config();
const {GoogleGenAI} = require("@google/genai");
const asynchandler = require("../utils/asynchandler");
const  PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { error } = require("console");
const { validateJsonFromAI, cleanQuizData } = require("../utils/aijsonparser");
const Courses = require("../models/coursemodel");
const Users = require("../models/usermodel");
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY)
const CertifcateModel = require("../models/CertificateModel")
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
    console.log(userName);
   const percentage = (score / 10) * 100 ;
   await CertifcateModel.create({
    userId,courseId });
   if(percentage >= 60) {
    const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment;`);
doc.pipe(res);
doc.image(path.join(__dirname, "../../assets/logo.png"), 50, 30, { width: 80 });

doc.moveDown(3);
doc.fontSize(24).text("Certificate of Achievement", { align: "center" });
doc.moveDown();
doc.fontSize(16).text("This Certifies that", { align: "center" });
doc.moveDown();
doc.font("Helvetica-Bold").fontSize(24).fillColor("#00FFFF").text(`${userName.toUpperCase()}`, { align: "center"});
doc.fillColor("black");
doc.font("Helvetica");
doc.moveDown();
doc.fontSize(16);
doc.text('has successfully completed the course ', { continued: true });
doc.font('Helvetica-Bold').text(`"${courseTitle}"`, { continued: true });
doc.font('Helvetica').text('.', {continued : true});
doc.text('with a Score of  ', { continued: true });
doc.font('Helvetica-Bold').text(`${percentage.toFixed(2)}%`, { continued: true });
doc.font('Helvetica').text('.', {continued : true});

doc.image(path.join(__dirname, "../../assets/sign.png"), 400, 450, { width: 100 });
doc.fontSize(12).text("Authorized by:", 400, 400);
doc.fontSize(14).text("Krishna Darsh", 400, 425, { align: "left" });
doc.end();
return;
   }
else {
  return res.status(201).json({
    failed: true,
    message: "You did not meet the passing Criteria (60%)",
  });
}
  }
 catch(error) {
    console.error(error);
    res.status(500).json({error : "Error Sumbmiting the Quiz"})
 }
}
module.exports = {generateQuiz , submitQuiz};




