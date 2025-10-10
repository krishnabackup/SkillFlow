require("dotenv").config();
const Users = require("../../src/models/usermodel");
const OpenAI = require("openai");
const HF_API_TOKEN = process.env.HF_KEY;

const generateRoadmap = async (req,res) => {
 try {
    console.log(HF_API_TOKEN);
    const user = await Users.findById(req.user.id).lean();
    if (!user) return res.status(401).json({ message: "User not found" });
    const goal = user.profile?.goals[0];
    const experience = user.profile?.current_role;
    const skills = user.profile?.skills
    console.log(skills);

const userpromt = `
You are an expert career mentor who creates structured skill-learning roadmaps.
Your job is to return a JSON roadmap for a learner.
Generate a skill roadmap for a user who wants to become a ${goal} or learn a ${goal}.
Use the following existing skills: ${JSON.stringify(skills) || "None"}. with Experience ${experience}
Each roadmap must contain multiple "stages" showing what to learn first, next, and finally.
It should also include totalduration of roadmap 
Output the roadmap in structured JSON
Format:
{
  "title": string,
  "totalduration" : number,
  "stages": [
    {
      "stage": string,
      "description": string,
      "durationperweeks": number,
      "skills": [string],
      "recommended_courses": [string]
    }
  ]
}
`

const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-large",
      {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: userpromt,
        parameters: { max_new_tokens: 400, return_full_text: false },
      }),
    }
);
if (!response.ok) {
  const text = await response.text(); // get error body as text
  throw new Error(`Hugging Face API error ${response.status}: ${text}`);
}
const roadmap = await response.json();
res.json({success : true , roadmap});
 }
 catch(error) {
    console.error("Error generating roadmap:", error);
    res.status(500).json({ success: false, message: "Roadmap generation failed", error });
 }
}

module.exports = {generateRoadmap};