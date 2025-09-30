const request = require('supertest');
const app = require("../src/app");
const mongoose = require('mongoose');
const User = require('../src/models/usermodel');
const Course = require('../src/models/coursemodel');
const jwt = require('jsonwebtoken');
const { json } = require('express');
const bcrypt = require("bcryptjs");
const { put } = require('../src/routes/courseroute');

describe("Courses Api ",() => {
  let adminToken,userToken,adminUser,normalUser;

  beforeAll(async () => {
    await User.deleteMany({});
    await Course.deleteMany({});

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
  adminToken = jwt.sign({id : adminUser._id},process.env.JWT_SECRET,{expiresIn : process.env.JWT_EXPIRES_IN});
  userToken = jwt.sign({id : normalUser._id},process.env.JWT_SECRET,{expiresIn : process.env.JWT_EXPIRES_IN});
 });

  afterAll(async () => {
    await mongoose.connection.close();
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
    console.log(res.statusCode, res.body);
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

