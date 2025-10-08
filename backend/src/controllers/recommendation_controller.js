const Users = require("../models/usermodel");
const Course = require("../models/coursemodel");

function normalizeSkillName(skills) {
  if (!Array.isArray(skills)) return [];
  return skills
    .map(skill =>
      typeof skill === "object" && skill?.name ? skill.name : skill
    )
    .filter(Boolean)
    .map(s => String(s).toLowerCase());
}

const getRecommendation = async (req, res, next) => {
  try {
    // ✅ Fetch user
    const user = await Users.findById(req.user.id).lean();
    if (!user) return res.status(401).json({ message: "User not found" });

    // ✅ Normalize skills
    const userSkillsArray = normalizeSkillName(user.profile?.skills || []);
     console.log(userSkillsArray);
    // Create skill → level map
    const skillMap = {};
    (user.profile?.skills || []).forEach(s => {
      const name = (s.name || s).toString().trim().toLowerCase();
      skillMap[name] = s.level ?? 0;
    });

    // ✅ Pagination setup
    const limit = Number(req.query.limit) || 10;
    const page = Math.max(1, Number(req.query.page) || 1);
    const skip = (page - 1) * limit;

    let results = [];
    // ✅ Case 1: No skills → show beginner courses
    if (userSkillsArray.length === 0) {
      const begginerCourses  = await Course.find({ difficulty: "beginner" })
        .sort({ enrollmentsCount: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
        
            results = begginerCourses.map(c => ({
             course: c,
             matched: c.skills || [],
             matchedCount: (c.skills || []).length,
             avgLevel: 0,
            fillGapsScore: 0,
            reinforceScore: 0,
        }))
    } else {
      // ✅ Case 2: Score-based recommendation
      const allCourses = await Course.find().lean();
      const scored = allCourses.map(c => {
        const courseSkills = (c.skills || []).map(s =>
          String(s).toLowerCase()
        );
        const matched = courseSkills.filter(s =>
          userSkillsArray.includes(s)
        );
        const matchedCount = matched.length;
        const strengthSum = matched.reduce(
          (acc, s) => acc + (skillMap[s] || 0),
          0
        );

        const popularity = c.enrollmentsCount || 0;
        const ageDays =
          (Date.now() - new Date(c.createdAt).getTime()) /
          (1000 * 60 * 60 * 24);
        const recencyScore = Math.max(0, 30 - ageDays); // favor newer courses
        const avgLevel = matchedCount ? strengthSum / matchedCount : 0;

        // base importance
        const base =
          matchedCount * 10 + Math.log(1 + popularity) * 2 + recencyScore;

        // ✅ Two scoring formulas
        const fillGapsScore = base - avgLevel * 2; // recommend skills user is weak at
        const reinforceScore = base + avgLevel * 2; // reinforce strengths

        return {
          course: c,
          matched,
          matchedCount,
          avgLevel,
          fillGapsScore,
          reinforceScore,
        };
      });

      results = scored;
    }

    // ✅ Paginate both results
    const fillGaps = [...results]
      .sort((a, b) => b.fillGapsScore - a.fillGapsScore)
      .slice(skip, skip + limit);

    const reinforce = [...results]
      .sort((a, b) => b.reinforceScore - a.reinforceScore)
      .slice(skip, skip + limit);

    // ✅ Send full response
    res.json({
      page,
      limit,
      totalResults: results.length,
      fillGaps,
      reinforce,
    });
    console.log(res.data);
  } catch (error) {
    next(error);
  }
};

module.exports = {getRecommendation}