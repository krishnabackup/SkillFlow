const {normalizeSkillName} = require("../utils/skillNormailizer");
const normalizeSkills = (req,res,next) => {
    try{
         if (req.body.skills) req.body.skills = normalizeSkillName(req.body.skills);
         console.log(req.body.skills);
         next();
    }
    catch(erorr){
        next(erorr);
    }
}

module.exports = {normalizeSkills}