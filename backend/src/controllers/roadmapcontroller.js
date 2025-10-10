const Users = require("../../src/models/usermodel")
const Courses = require("../../src/models/coursemodel")

function normalizeSkillList(skills) {
  if (!Array.isArray(skills)) return [];
  return skills
    .map(skill =>
      typeof skill === "object" && skill?.name ? skill.name : skill
    )
    .filter(Boolean)
    .map(s => String(s).toLowerCase());
}

function normalizeSkillName(skill) {
    if(!skill) return " ";
    return String(skill).trim().toLowerCase();
}

function scoreCourse(course,userSkillMap) {
    const courseSkills = (course.skills || []).map( s => String(s).toLowerCase());
    const matched = courseSkills.filter(s = userSkillMap.hasOwnProperty(s));
    const matchedCount = matched.length;
    const strengthSum = matched.reduce((acc,s) => acc + (userSkillMap[s] || 0), 0);
    const avgLevel = matchedCount ? (strengthSum/matchedCount) : 0;
    const popularity = course.enrollmentsCount || 0;
    const ageDays = (Date.now() - new Date(course.createdAt).getTime());
    const recencyScore = Math.max(0, 30 - ageDays);
    const base = matchedCount * 10 + Math.log(1 + popularity) * 2 + recencyScore;

    const fillGapsScore = base - avgLevel * 2;
    const reinforceScore = base + avgLevel * 2;

    return { matched, matchedCount, avgLevel, fillGapsScore, reinforceScore}

}

function topologicalSortCourses(courses) {

    const idToCourse = new Map(courses.map(c => [String(c._id),c]));

    const indegree = new Map();
    const adj = new Map();
    idToCourse.forEach((course,id) => { indegree.set(id,0); adj.set(id,[]); });

    idToCourse.forEach((course,id) => {
        (course.prerequisites || []).forEach(p => {
            const pid = String(p);
            if(idToCourse.has(pid)) {
                adj.get(pid).push(id);
                indegree.set(id,indegree.get(id) + 1);
            }
        });
    });

    //kahn 

    const q = [];
    indegree.forEach((deg,id) => {if(deg === 0) q.push(id)});
    const ordered = [];
    while(q.length) {
        const id = q.shift();
        ordered.push(idToCourse.get(id));
        for(const nb of adj.get(id)){
            indegree.set(nb,indegree.get(nb) - 1);
            if(indegree.get(nb) === 0) q.push(nb);
        }
    }

     // detect cycle: if ordered.length < courses.length, cycle(s) exist
  if (ordered.length !== courses.length) {
    // fallback: append remaining nodes (resolve using createdAt or difficulty)
    const remaining = courses.filter(c => !ordered.includes(c))
      .sort((a,b) => (a.difficulty||'').localeCompare(b.difficulty||'') || new Date(a.createdAt) - new Date(b.createdAt));
    return ordered.concat(remaining);
  }
  return ordered;
}



function paginateAndSchedule(listWithScore,page,limit,hoursePerWeek, weeksDesired = null) {
    const skip = (page - 1) * limit;
    const pageItems = listWithScore.slice(skip,skip + limit);
    let weeks = scheduleCourses(pageItems,hoursePerWeek);
    // weeks specified by user 
    if(weeksDesired) {
        weeks = adjustRoadmapToWeeks(weeks,weeksDesired);
    }
    return { items : pageItems, weeks : weeks}
}

function adjustRoadmapToWeeks(weeks, weeksDesired) {
  const totalWeeks = weeks.length;
  if(totalWeeks === 0) return weeks;

  const scaleFactor = weeksDesired / totalWeeks;

  const adjustedStages = weeks.map(week => ({
    ...week,
    duration_weeks: Math.max(1, Math.round(week.duration_weeks * scaleFactor))
  }));

  return adjustedStages;
}
const generateRoadmap = async(req,res,next) => {
    try{
       const user = await Users.findById(req.user.id).lean();
       if(!user) return res.status(404).json({message : "User not found"});

       const limit = Number(req.query.limit) || 10;
       const page = Math.max(1,Number(req.query.page) || 1);
       const weeksDesierd = req.query.weeks ? Number(req.query.weeks) : null;
       const hoursPerWeekOverride = req.query.hoursPerWeek ? Number(req.query.hoursPerWeek) : user.profile?.availabilityHours


       const userSkillsArray = normalizeSkillList(user.profile?.skills)
       const userSkillMap = {};
       (user.profile?.skills || []).forEach( s => {
        const name = normalizeSkillName(s.name || s)
        userSkillMap[name] = Number(s.level || 0);
       });

       const enrrolledIds = new Set((user.profile?.enrollments || [0]).map( e => String(e.course)));
       const candidateQuery = {_id : { $nin : [...enrrolledIds]}};

       let candidates = await Courses.find(candidateQuery).limit(500).lean();

       const scored = candidates.map(c => {
        const sc = scoreCourse(c,userSkillMap);
        return {course : c , ...sc};
       });

        // 3) optionally filter to those with at least one matched skill, or keep all
    // For UX, you may want to keep all but sort them.
     
    const sortedByFill = scored.slice().sort((a,b) => b.fillGapsScore - a.fillGapsScore);
    const sortedByReinforce = scored.slice().sort((a,b) => b.reinforceScore - a.reinforceScore);

      // 5) sequence respecting prerequisites: topological sort expects course docs list
    const topSortedFill = topologicalSortCourses(sortedByFill.map(s => s.course));
    // We need to reattach scores after sorting:
    const topSortedFillWithScore = topSortedFill.map(c => scored.find(s => String(s.course._id) === String(c._id)));

    // For reinforce do the same:
    const topSortedReinforce = topologicalSortCourses(sortedByReinforce.map(s => s.course));
    const topSortedReinforceWithScore = topSortedReinforce.map(c => scored.find(s => String(s.course._id) === String(c._id)));
    
    // 6) scheduling: pick hours/week
    const hoursPerWeek = hoursPerWeekOverride || user.profile?.availabilityHours || 5;
    const fillPages = paginateAndSchedule(topSortedFillWithScore, page, limit, hoursPerWeek, weeksDesired);
    const reinforcePages = paginateAndSchedule(topSortedReinforceWithScore, page, limit, hoursPerWeek, weeksDesired);
    
    const totalResults = scored.length;
    const response = {
      page,
      limit,
      totalResults,
      preference,
      fillGaps: fillPages,
      reinforce: reinforcePages
    };
     
    res.json(response);
    }
    catch(error){
    next(error)
    }
}