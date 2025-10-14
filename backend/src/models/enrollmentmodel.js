const mongoose = require("mongoose")

 const ProgressSchema = new mongoose.Schema({
    lessonId : {type : String},
    status: { type: String, enum: ['not_started','in_progress','completed'], default: 'not_started' },
    completedAt : {type : Date , default : null},
    meta : {type : mongoose.Schema.Types.Mixed}
 },{_id : false});


const EnrollmentSchema  = new mongoose.Schema({
    user : {type : mongoose.Schema.Types.ObjectId , ref : 'User' , required : true , index : true},
    course : { type : mongoose.Schema.Types.ObjectId , ref : 'Course', required : true , index : true},
    progress : [ProgressSchema],
    startedAt : {type : Date , default : Date.now},
    completedAt : { type : Date , default : null},
    status: { type: String, enum: ['active','completed','dropped'], default: 'active' }
},{timestamps : true});

module.exports = mongoose.model('Enrollment', EnrollmentSchema)