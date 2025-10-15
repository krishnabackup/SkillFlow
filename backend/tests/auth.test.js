const mongoose  = require("mongoose");
const request = require("supertest")
const app = require("../src/app")
const User = require("../src/models/usermodel")

describe("Authentication API",() => {
    const adminLogin = {
        email : 'admin@gmail.com',
        password : 'Password@1'
    }
    beforeAll(async () => {
    })
    afterAll(async()=> {
     await mongoose.connection.close();
    });
    test("Should login Properly", async () => {
        const res = await request(app)
        .post('/api/auth/login')
        .send(adminLogin)
        console.log(res.body)
    })
})