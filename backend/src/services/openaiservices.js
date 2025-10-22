require("dotenv").config();
const Users = require("../../src/models/usermodel");
const Courses = require("../models/coursemodel")
const { InferenceClient } = require("@huggingface/inference");
const RoadMap = require("../models/roadmapmodel");
const { validateJsonFromAI } = require("../utils/aijsonparser");
const HF_API_TOKEN = process.env.HF_ACCESS_TOKEN;
const hf = new InferenceClient(HF_API_TOKEN);
const asynchandler = require("../utils/asynchandler");

const generateRoadmap = async (req, res) => {
  try {
    console.log("Using Hugging Face Token:", HF_API_TOKEN ? "Loaded ✅" : "Missing ❌");

    const user = await Users.findById(req.user.id).lean();
    if (!user) return res.status(401).json({ message: "User not found" });
    
    //fetch recommendation to Seed  AI 
    
    const recommendation = require("../services/recommendationInternalCall")
    const rec = await recommendation.getRecommendationInternalCall(req.user.id);
    // top N reccomendation

    const top = (rec.fillGaps || []).slice(0,6).map(r => {
      const c = r.course || r;
      return { title : c.title , description : c.description || "",skills : c.skills || [] };
    });


    const goal = user.profile?.goals?.[0];
    const experience = user.profile?.current_role || "beginner";
    const skills = user.profile?.skills || [];

    const systemPrompt = `
You are an expert career mentor who creates structured skill-learning roadmaps.
Return only **valid JSON**. 
Each roadmap must contain multiple "stages" showing what to learn first, next, and finally.
It should also include totalduration of roadmap and it should not exceed 56 weeks,course resources title 
and its type like whether it is youtube video,online course free or website with its clickable url to navigate to that site.
Don't recoomend paid courses.Provide a link between all stages and return it in edges attribute as shown below.
provide recommended_courses always even it is project building phase or final phase.
Output only valid JSON with double quoted keys and string values, no comments or trailing commas.
Respond ONLY with valid JSON. Do not include explanations or code block markers
Format:
{
  "title": string,
  "totalduration": number,
  "stages": [
    {
      "_id":"stage_1",
      "stage": string,
      "description": string,
      "duration_weeks": number,
      "skills": [string],
      "recommended_courses": [
        {
          "title": string,
          "description": string,
          "difficulty": string,
          "skills_learned": [string],
          "resources": [
            {
              "title": string,
              "url": string,
              "type": string
            }
          ]
        }
      ]
    }
  ],
"edges":[
  { "id":"e_stage1_stage2","source":"stage_1","target":"stage_2" }
  ]
}`;

    const userPrompt = `
Generate a skill roadmap for a user who wants to become a ${goal}.
Current experience: ${experience}.
Existing skills: ${skills.length ? skills.join(", ") : "None"}.
Seed courses: ${JSON.stringify(top)}.
Output **only the JSON** (no markdown or text).`;

    const response = await hf.chatCompletion({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 4048,
    });

    const roadmap =  validateJsonFromAI(response);


    const normalizedStages = roadmap.stages.map((s, i) => ({
      _id: s._id || `stage_${i+1}`,
      stage: s.stage,
      description: s.description || '',
      duration_weeks: Number(s.duration_weeks || 1),
      skills: (s.skills || []).map(String),
      recommended_courses: (s.recommended_courses || []).map(rc => ({
        title: rc.title,
        description : rc.description,
        difficulty  : rc.difficulty,
        skills_learned : rc.skills_learned,
        resources : (rc.resources || []).map(res => ({
              title : res && res.title ? res.title : "",
              url:res && res.url ?  res.url : "",
              type: res && res.url ? res.type : "link",
        }))
      })),
    }));
    console.log("Normalized Stages:", normalizedStages.recommended_courses);
    const roadmapCourses = roadmap.stages.flatMap(stage => 
      (stage.recommended_courses || []).map(rc => (
        {
        title: rc.title,
        description : rc.description,
        difficulty  : rc.difficulty,
        skills_learned : rc.skills_learned,
        resources : (rc.resources || []).map(res => ({
        title : res && res.title ? res.title : "",
        url:res && res.url ?  res.url : "",
        type: res && res.url ? res.type : "link",
        }))
        }
      ))
    );
    const newRoadmap = new RoadMap({
      title : roadmap?.title,
      owner : user._id,
      totalduration : roadmap?.totalduration,
      stages : normalizedStages,
      edges: roadmap?.edges || []
    });
    await newRoadmap.save();
    res.json({ success: true, roadmap });
  } catch (error) {
    console.error("Error generating roadmap:", error);
    res.status(500).json({ success: false, message: "Roadmap generation failed", error: error.message });
  }
};

const getRoadmap = asynchandler(async(req,res,next) => {
 const user = await Users.findById(req.user.id).lean();
 if(!user) return res.status(404).json({message : "User not found"});

 const roadmap = await RoadMap.find({owner : user._id});
 if(!roadmap) return res.status(404).json({message : "Roadmap not found or empty"});
res.status(200).json({
  roadmap
})
});

const getRoadmapById = asynchandler(async(req,res,next) => {
 const roadmap = await RoadMap.findById(req.params.id);
 if(!roadmap) return res.status(404).json({message : "Roadmap not found"}); 
 recommandedCourses = roadmap.stages.flatMap(s => s.recommended_courses || []);
 console.log("Recommanded Courses:", recommandedCourses);
 res.status(200).json(recommandedCourses);
});

module.exports = { generateRoadmap,getRoadmap ,getRoadmapById};