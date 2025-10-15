require("dotenv").config();
const request = require('supertest');
const app = require("../src/app");
const mongoose = require('mongoose');
const User = require('../src/models/usermodel');
const Course = require('../src/models/coursemodel');
const jwt = require('jsonwebtoken');
const { json } = require('express');
const bcrypt = require("bcryptjs");
const { put } = require('../src/routes/courseroute');
const { connectTestDB, closeTestDB } = require("./setupTestDb");

describe("Courses Api ",() => {
  let adminToken,userToken,adminUser,normalUser;
  const userlogin = {
    email: 'learner@test.com',
    password:'Password123',
  }
  const adminLogin = {
    email: 'admin@test.com',
    password: 'Password123'
  }
  beforeAll(async () => {
    await connectTestDB();
    process.env.JWT_SECRET = process.env.JWT_SECRET || "changeme";
    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      passwordHash: await bcrypt.hash('Password123',10),
      role: 'admin',
    });

    normalUser = await User.create({
      name: 'Learner User',
      email: 'learner@test.com',
      passwordHash: await bcrypt.hash('Password123',10),
      role: 'learner',
    });

    const loginResonseUser = await request(app)
    .post('/api/auth/login')
    .send(userlogin)
    
     const loginResonseAdmin = await request(app)
    .post('/api/auth/login')
    .send(adminLogin)
    
  adminToken = loginResonseAdmin.body.token;
  userToken = loginResonseUser.body.token
 });

  afterAll(async () => {
    await closeTestDB();
})

  test('GET /api/courses fetch courses',async () => {
    const res = await request(app).get('/api/courses');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
  })

  //User can't do post put delte task 

  test("POST /api/courses new course",async ()=> {
    const res = await request(app)
    .post('/api/courses')
    .set('Authorization',`Bearer ${userToken}`)
    .send({
        title: 'Node.js Basics',
      });
    expect(res.statusCode).toBe(403);
    
  })

  //admin can do all function

    test("POST /api/courses new course",async ()=> {
    const res = await request(app)
    .post("/api/courses")
    .set('Authorization', `Bearer ${adminToken}`)
    .send( { title: "Cloud Fundamentals", skills:["Cloud"], difficulty:"beginner", description:"Intro to cloud." });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe('Cloud Fundamentals');
    
  });

  test("PUT /api/courses  update courses",async () => {
    const course = await Course.findOne({ title: 'Cloud Fundamentals' });
    const res = await request(app)
    .put(`/api/courses/${course._id}`)
    .set('Authorization',`Bearer ${adminToken}`)
    .send({title : "Updated Cloud Fundamentals"});
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Cloud Fundamentals");
  });

  test('DELETE /api/courses delete courses',async () => {
    const course = await Course.findOne({title : "Updated Cloud Fundamentals"});
    const res = await request(app)
    .delete(`/api/courses/${course._id}`)
    .set('Authorization',`Bearer ${adminToken}`)
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Delete Sucessfully completed');
  });
});

