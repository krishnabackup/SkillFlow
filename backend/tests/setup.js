const mongoose = require("mongoose");

beforeAll(async () => {
  const testDbUrl = process.env.MONGO_URI_TEST;
  await mongoose.connect(testDbUrl);
});


beforeEach(async () => {
    const collections = await mongoose.connection.collection();
    for(let collection of collections) {
        await collection.deleteMany({})
    }
});

afterAll(async () => {
  await mongoose.connection.close();
});