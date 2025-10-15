const jwt = require('jsonwebtoken');
const Users = require("../models/usermodel")

const protect  = async (req,res,next) => {
  let token;
  const authHeader = req.headers.authorization;

  if(authHeader && authHeader.startsWith('Bearer ')) token = authHeader.split(' ')[1];
  if(!token) return res.status(401).json({message : "Not Authorized ,token missing"});

  try {
     const decode = jwt.verify(token,process.env.JWT_SECRET || "changeme");
     const user = await Users.findById(decode.id).select('-passwordHash')
     if(!user) return res.status(401).json({message : "Not Authorized"})
     req.user = {id : user._id, role: user.role};
     next()
  }
  catch(error) {
    return res.status(401).json({ message: 'Token invalid or expired' , error_message : error});
  }
}

module.exports = { protect }