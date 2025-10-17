const mongoose  = require("mongoose");
const request = require("supertest")
const app = require("../src/app")
const User = require("../src/models/usermodel");
const e = require("express");
const { connectTestDB, closeTestDB } = require("./setupTestDb");

describe("Authentication API",() => {
    const adminLogin = {
        email : 'admin@gmail.com',
        password : 'Password@1'
    }
    beforeAll(async () => {
     await connectTestDB();
    })
    afterAll(async()=> {
     await closeTestDB();
    });
    test("Should login Properly", async () => {
        const res = await request(app)
        .post('/api/auth/login')
        .send(adminLogin)
        expect(res.statusCode).toBe(200);
    })
    test("Should not login properly because of invalid credential",async () => {
        const res = await request(app)
        .post('/api/auth/login')
        .send({email : "adm@gmail.com",password : "Password@1"})
        expect(res.statusCode).toBe(401)
        expect(res.body.message).toBe("Invalid Credentials")
    })
})