const mongoose = require("mongoose")

const ResourceSchema  = mongoose.Schema({
    title: {type : String , required : true},
    url : String,
    type : {type : String}
}, {_id : false});

const courseSchema = mongoose.Schema({
    title : {type : String , required : true, index : true},
    description : {type: String },
    skills: { type: [String], default: [] }, // tags/skills taught
    difficulty: { type: String, enum: ['beginner','intermediate','advanced'], default: 'beginner' },
    prerequisites: { type: [String], default: [] },
    estimatedHours: { type: Number, default: 5 },
    enrollmentsCount : {type : Number, default : 0 },
    resources: { type: [ResourceSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
    createdBy : {type : mongoose.Schema.Types.ObjectId,ref : 'User'},
    updatedAt: { type: Date, default: Date.now }
},{
timestamps : true
}
);


courseSchema.index({ title : 'text' , description : 'text'});

courseSchema.index({ skills: 1 });



module.exports = mongoose.model('Course',courseSchema);
