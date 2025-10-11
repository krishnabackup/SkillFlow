const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
  title: String,
  url: String,
  type: String
});

const EdgesSchema = new mongoose.Schema({
    id: String,
    source: String,
    target: String
})
const RecommendedCourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: String,
  skills_learned: [String],
  resources: [ResourceSchema]
});

const StageSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  stage: { type: String, required: true },
  description: String,
  duration_weeks: Number,
  skills: [String],
  recommended_courses: [RecommendedCourseSchema]
});

const RoadMapSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  totalduration: { type: Number, default: 0 },
  stages: [StageSchema],
  edges : [EdgesSchema]
}, { timestamps: true });

module.exports = mongoose.model("RoadMap", RoadMapSchema);
