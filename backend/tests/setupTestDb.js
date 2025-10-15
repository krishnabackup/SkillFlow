const mongoose = require('mongoose');
let mongoServer;

module.exports.connectTestDB = async () => {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
};

module.exports.closeTestDB = async () => {
  if (mongoose.connection.readyState !== 1) { // 1 = connected
    console.warn("Mongoose not connected, skipping dropDatabase");
  } else {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }

  if (mongoServer) {
    await mongoServer.stop();
  }
};
