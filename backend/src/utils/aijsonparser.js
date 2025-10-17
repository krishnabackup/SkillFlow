const validateJsonFromAI = (response) => {
    const text = (response?.choices?.[0].message?.content).toString();
    if(!text) throw new Error("Empty AI Response");

 let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();

  
  const m = cleaned.match(/\{[\s\S]*\}/);
  if(!m) throw new Error("No JSON object detected in AI output");
  try {
    const parsed = JSON.parse(m[0]);
    return parsed;
  } catch(e) {
    throw new Error("Invalid JSON from AI: " + e.message + " - raw: " + (m[0].slice(0,200)));
  }
    
}


module.exports = {validateJsonFromAI}