
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['learner','admin'], default: 'learner' },
  createdAt: { type: Date, default: Date.now },
  profile: {
    skills: [{ name: String, level: Number }], // e.g. {name:'React', level:2}
    availabilityHours: { type: Number, default: 1 }
  }
});

module.exports = mongoose.model('User', userSchema);
