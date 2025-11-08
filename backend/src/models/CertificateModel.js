const mongoose = require("mongoose");



const CertificateSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId , ref : 'User'},
    userName : {type : String},
    courseId : {type  :mongoose.Schema.Types.ObjectId , ref : "Course"},
    courseTitle : {type : String },
    certificate : {type : Buffer , required : true},
    contentType : {type : String , default : 'application/pdf'},
    createdAt : {type : Date , default : Date.now}
})

module.exports = mongoose.model("CertificateModel",CertificateSchema)