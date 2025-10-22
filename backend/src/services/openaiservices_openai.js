require("dotenv").config();
const Users = require("../../src/models/usermodel");
const Courses = require("../models/coursemodel")
const RoadMap = require("../models/roadmapmodel");
const { validateJsonFromAI } = require("../utils/aijsonparser");

const OPENAI_API_KEY = process.env.OpenAI_KEY || "";

const callOpenAIChat = async (messages, max_tokens = 2048, model = 'gpt-4o-mini') => {
  if (!OPENAI_API_KEY) throw new Error('Missing OpenAI API key in OPENAI_API_KEY');

  const body = {
    model,
    messages,
    max_tokens,
    temperature: 0.2,
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const t = await res.text();
    const e = new Error(`OpenAI request failed: ${res.status} ${res.statusText} - ${t}`);
    e.status = res.status;
    throw e;
  }

  const data = await res.json();
  return data;
}

const generateRoadmap = async (req, res) => {
  try {
    console.log("Using OpenAI Key:", OPENAI_API_KEY ? "Loaded ✅" : "Missing ❌");

    const user = await Users.findById(req.user.id).lean();
    if (!user) return res.status(401).json({ message: "User not found" });

    const recommendation = require("../services/recommendationInternalCall")
    const rec = await recommendation.getRecommendationInternalCall(req.user.id);
    const top = (rec.fillGaps || []).slice(0,6).map(r => {
      const c = r.course || r;
      return { title : c.title , description : c.description || "",skills : c.skills || [] };
    });

    const goal = user.profile?.goals?.[0];
    const experience = user.profile?.current_role || "beginner";
    const skills = user.profile?.skills || [];

    const systemPrompt = `You are an expert career mentor who creates structured skill-learning roadmaps. Return only valid JSON. Each roadmap must contain multiple \"stages\" showing what to learn first, next, and finally. It should also include totalduration of roadmap and it should not exceed 56 weeks,course resources title and its type like whether it is youtube video,online course free or website with its clickable url to navigate to that site. Don't recoomend paid courses.Provide a link between all stages and return it in edges attribute as shown below. provide recommended_courses always even it is project building phase or final phase. Output only valid JSON with double quoted keys and string values, no comments or trailing commas. Respond ONLY with valid JSON. Do not include explanations or code block markers`;

    const userPrompt = `Generate a skill roadmap for a user who wants to become a ${goal}. Current experience: ${experience}. Existing skills: ${skills.length ? skills.join(", ") : "None"}. Seed courses: ${JSON.stringify(top)}. Output only the JSON (no markdown or text).`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const response = await callOpenAIChat(messages, 3000, process.env.OPENAI_MODEL || 'gpt-4o-mini');

    // adapt to the same validator which expects response.choices[0].message.content
    const fakeResponse = { choices: [ { message: { content: response.choices?.[0]?.message?.content || response.choices?.[0]?.text || '' } } ] };

    const roadmap = validateJsonFromAI(fakeResponse);

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
    console.error("Error generating roadmap (OpenAI):", error);
    res.status(500).json({ success: false, message: "Roadmap generation failed", error: error.message });
  }
};

const getRoadmap = async(req,res,next) => {
 const user = await Users.findById(req.user.id).lean();
 if(!user) return res.status(404).json({message : "User not found"});

 const roadmap = await RoadMap.find({owner : user._id});
 if(!roadmap) return res.status(404).json({message : "Roadmap not found or empty"});
res.status(200).json({
  roadmap
})

}

module.exports = { generateRoadmap,getRoadmap };
