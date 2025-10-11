require("dotenv").config();
const Users = require("../../src/models/usermodel");
const { InferenceClient } = require("@huggingface/inference");
const RoadMap = require("../models/roadmapmodel");
const HF_API_TOKEN = process.env.HF_ACCESS_TOKEN;
const hf = new InferenceClient(HF_API_TOKEN);

const generateRoadmap = async (req, res) => {
  try {
    console.log("Using Hugging Face Token:", HF_API_TOKEN ? "Loaded ✅" : "Missing ❌");

    const user = await Users.findById(req.user.id).lean();
    if (!user) return res.status(401).json({ message: "User not found" });

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
Output **only the JSON** (no markdown or text).`;

    const response = await hf.chatCompletion({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 4048,
    });

    let content = response.choices?.[0]?.message?.content || "";
    console.log("Raw HF response:\n", content.slice(0, 500));

    // 🧹 Clean out extra markdown or text
    content = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // ✅ Extract only the JSON part (in case model added text around)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No valid JSON object found in model output");

    const roadmap = JSON.parse(jsonMatch[0]);
    const newRoadmap = new RoadMap({
      title : goal,
      owner : user._id,
      totalduration : roadmap?.totalduration,
      stages : roadmap?.stages,
      edges: roadmap?.edges || []
    });
    await newRoadmap.save();
    res.json({ success: true, roadmap });
  } catch (error) {
    console.error("Error generating roadmap:", error);
    res.status(500).json({ success: false, message: "Roadmap generation failed", error: error.message });
  }
};

const getRoadmap = async(req,res,next) => {
 const user = await Users.findById(req.user.id).lean();
 if(!user) return res.status(404).json({message : "User not found"});

 const roadmap = await RoadMap.find({owner : user._id});
 if(!roadmap) return res.status(404).json({message : "Roadmap not found or empty"});
 
 console.log(roadmap);
res.status(200).json({
  roadmap
})

}

module.exports = { generateRoadmap,getRoadmap };
