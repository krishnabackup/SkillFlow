const skillSynonyms = require("../../data/skillSynonyms")
const Fuse = require("fuse.js");
const levenshtein = require("fast-levenshtein");
const natural = require("natural");

const canonicalSkills = Object.keys(skillSynonyms);

let fuseIndex = null;
fuseIndex = new Fuse(canonicalSkills,{
    includeScore : true,
    threshold : .45
});

const normalizeSkillName = (input) => {
  const length = input.length;
  console.log(length);
  for(let i = 0;i<length;i++) {
  let skillName = input[i].name;
  console.log(skillName);
  if(!skillName) return null 
  if (typeof skillName !== "string") return null;
  const lower = skillName.trim().toLowerCase();
  if(!lower) return null;

  const directMatch = canonicalSkills.find(skill => skill.toLowerCase() === lower);
  if(directMatch) input[i].name = directMatch;

  const fuseResult = fuseIndex.search(lower);

  //fuse.js 
  if(fuseResult.length > 0 && fuseResult[0].score < 0.45) {
    console.log("Fuse",fuseResult[0].item);
    input[i].name = fuseResult[0].item;
  }

  //lav
  let closest = null;
  let bestDist = Infinity;
  for(const synon of canonicalSkills){
    const dist  = levenshtein.get(lower,synon.toLowerCase());
    if(dist < bestDist) {
        bestDist = dist;
        closest = synon;
    }
  }
  if(bestDist <= 2) { console.log("lav",closest); input[i].name = closest }


  //methaphonic 
  const Meta  = new natural.Metaphone();
  const inputMeta = Meta.process(lower);
  for(const synon of canonicalSkills){
    if(Meta.compare(synon.toLowerCase(),inputMeta)){
        console.log("Meta",synon);
        input[i].name = synon;
    }
  }
  input[i].name.charAt(0).toUpperCase() + input[i].name.slice(1)
  }
  return input;
}

module.exports = {normalizeSkillName}


