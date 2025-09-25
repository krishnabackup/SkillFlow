const mongoose  = require("mongoose")

const connectDB =  async  (mongoDb) => {
  try {
     await mongoose.connect(mongoDb);
     console.log("Mongo URI:", process.env.MONGO_URI);
     console.log("Db Connected");
    
  }
  catch(error) {
    console.log(error);
  }
}

module.exports = connectDB;