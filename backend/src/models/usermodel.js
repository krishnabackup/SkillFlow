
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true , index: true},
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['learner','admin'], default: 'learner' },
  createdAt: { type: Date, default: Date.now },
  profile: {
    current_role: { type:String, enum : ['student','fresher','experienced'],default : 'student' },
    skills: [{ name: String , level: Number }], // e.g. {name:'React', level:2}
    availabilityHours: { type: Number, default: 1 },
    courses:{type : mongoose.Schema.Types.ObjectId,ref : 'Course'}
  }
});

userSchema.pre("save",function(next){
  if(this.role === "admin"){
    this.profile = undefined;
  }
  else if(this.role === "learner" && !this.profile){
    this.profile = {};
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
