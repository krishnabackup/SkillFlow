const User = require("../models/usermodel")
const asynchandler = require("../utils/asynchandler")


//get me 

const getUsers = asynchandler(async (req,res) => {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if(!user) return res.status(401).json({message : "User not Found"});
    res.json(user)
});



const updateUser = asynchandler(async (req,res) => {
    const updates = {};
    const {name, email , skills , availabilityHours, current_role} = req.body;
  if (name) updates.name = name;
  if (email) updates.email = email.toLowerCase();
  if (typeof availabilityHours !== 'undefined') updates['profile.availabilityHours'] = availabilityHours;
  if(current_role) updates['profile.current_role'] = current_role
   if (skills) {
    if (Array.isArray(skills)) {
      updates['profile.skills'] = skills.map(s => {
        if (typeof s === 'string') return { name: s, level: 0 };
        // allow objects {name,level}
        return s;
      });
    } else if (typeof skills === 'string') {
      // "HTML, CSS, React"
      const arr = skills.split(',').map(s => s.trim()).filter(Boolean);
      updates['profile.skills'] = arr.map(name => ({ name, level: 0 }));
    }
  }
//update and return 

  const updated = await User.findByIdAndUpdate(
    req.user.id,
    { $set: updates },
    { new: true, runValidators: true, context: 'query' }
  ).select('-passwordHash');

  if (!updated) return res.status(404).json({ message: 'Update failed' });
  res.json(updated);

})

module.exports = {getUsers,updateUser}