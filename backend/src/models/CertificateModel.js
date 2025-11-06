const mongoose = require("mongoose");



const CertificateSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId , ref : 'User'},
    courseId : {type  :mongoose.Schema.Types.ObjectId , ref : "Course"},
    createdAt : {type : Date , default : Date.now}
})

module.exports = mongoose.model("CertificateModel",CertificateSchema)