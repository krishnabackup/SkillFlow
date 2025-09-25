const mongoose = require("mongoose")

const ResourceSchema  = mongoose.Schema({
    title: {type : String , required : true},
    url : String,
    type : {type : String}
}, {_id : false});

const courseSchema = mongoose.Schema({
    title : {type : String , required : true, index : true},
    description : {type: String },
     difficulty: { type: String, enum: ['beginner','intermediate','advanced'], default: 'beginner' },
     prerequisites: { type: [String], default: [] },
     estimatedHours: { type: Number, default: 5 },
     resources: { type: [ResourceSchema], default: [] },
     createdAt: { type: Date, default: Date.now }
});

courseSchema.index({ title : 'text' , description : 'text'});

module.exports = mongoose.model('Course',courseSchema);