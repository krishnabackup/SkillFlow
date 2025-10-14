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

const getRecommendationInternalCall = async (userId,{limit=12,page=1} = {}) => {
  try {
    // ✅ Fetch user
    const user = await Users.findById(userId).lean();
    if (!user) return res.status(401).json({ message: "User not found" });
    // ✅ Normalize skills
    const userSkillsArray = normalizeSkillName(user.profile?.skills || []);
    
    const userEnrollmentsId = new Set(
      (user.profile?.enrollments || []).map(e => e.course.toString())
    );
    // Create skill → level map
    const skillMap = {};
    (user.profile?.skills || []).forEach(s => {
      const name = (s.name || s).toString().trim().toLowerCase();
      skillMap[name] = s.level ?? 0;
    });

    // ✅ Pagination setup
    const skip = (page - 1) * limit;

    let results = [];
    let flag = false;
    // ✅ Case 1: No skills → show beginner courses
    if (userSkillsArray.length === 0) {
      const begginerCourses  = await Course.find({ difficulty: "beginner", _id : { $nin : [...userEnrollmentsId]} })
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
        flag = true;
    } else {
      // ✅ Case 2: Score-based recommendation
      const allCourses = await Course.find({_id : {$nin : [...userEnrollmentsId]}}).lean();
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
    if(!flag){
      return { page, limit, totalResults: results.length, fillGaps, reinforce };
    }
    else{
        return {
      page,
      limit,
      totalResults: results.length,
      fillGaps
        }
    };
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {getRecommendationInternalCall}