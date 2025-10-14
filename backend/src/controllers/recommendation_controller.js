const { getRecommendationInternalCall } = require("../services/recommendationInternalCall");


const getRecommendation = async (req,res,next) => {
  try {
     const userId = req.user.id;
     const limit = Number(req.query.limit) || 12;
     const page = Number(req.query.page) || 1
     console.log(page);
     const data = await getRecommendationInternalCall(userId,{limit,page})
     return res.json(data)
  }
  catch(error){
    console.error("Error message ",error)
    return res.status(500).json({message : "Internal Server Error"})
  }
};
module.exports = {getRecommendation}