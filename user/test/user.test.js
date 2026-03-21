


const request = require('supertest');
const express = require('express');

const userController = require('../controllers/user.controller');

jest.mock('../models/user.model');
const userModel = require('../models/user.model');

jest.mock('../models/blacklisttoken.model');
const blacklisttokenModel = require('../models/blacklisttoken.model');

jest.mock('bcryptjs');
const bcrypt = require('bcryptjs');

jest.mock('jsonwebtoken');
const jwt = require('jsonwebtoken');

jest.mock('../service/rabbit', () => ({
  subscribeToQueue: jest.fn()
}));

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.cookies = { token: "test-token" };
  req.user = { _id: "user123", name: "Test User" };
  next();
});

app.post('/register', userController.register);
app.post('/login', userController.login);
app.post('/logout', userController.logout);
app.get('/profile', userController.profile);
app.get('/accepted-ride', userController.acceptedRide);

beforeEach(() => {
  jest.clearAllMocks();
});



describe("Register", () => {

  it("should register new user", async () => {

    userModel.findOne = jest.fn().mockResolvedValue(null);
    bcrypt.hash = jest.fn().mockResolvedValue("hashed-password");

    userModel.prototype.save = jest.fn().mockResolvedValue({
      _id: "user123",
      name: "John",
      email: "test@test.com",
      _doc: { password: "hashed-password" }
    });

    jwt.sign = jest.fn().mockReturnValue("token123");

    const res = await request(app)
      .post('/register')
      .send({
        name: "John",
        email: "test@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(jwt.sign).toHaveBeenCalled();
  });

  it("should return error if user exists", async () => {

    userModel.findOne = jest.fn().mockResolvedValue({ email: "test@test.com" });

    const res = await request(app)
      .post('/register')
      .send({
        name: "John",
        email: "test@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

});


// ================= LOGIN =================
describe("Login", () => {

  it("should login user", async () => {

    const mockUser = {
      _id: "user123",
      password: "hashed",
      _doc: { password: "hashed" }
    };

    userModel.findOne = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    });

    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockReturnValue("token123");

    const res = await request(app)
      .post('/login')
      .send({
        email: "test@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(jwt.sign).toHaveBeenCalled();
  });

  it("should fail if user not found", async () => {

    userModel.findOne = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    const res = await request(app)
      .post('/login')
      .send({
        email: "test@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(400);
  });

});



describe("Logout", () => {

  it("should logout user", async () => {

    blacklisttokenModel.create = jest.fn().mockResolvedValue(true);

    const res = await request(app).post('/logout');

    expect(res.statusCode).toBe(200);
    expect(blacklisttokenModel.create).toHaveBeenCalledWith({
      token: "test-token"
    });
  });

});



describe("Profile", () => {

  it("should return user profile", async () => {

    const res = await request(app).get('/profile');

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe("user123");
  });

});



describe("Accepted Ride", () => {

  it("should respond (200 or timeout 204)", async () => {

    const res = await request(app).get('/accepted-ride');

    expect([200, 204]).toContain(res.statusCode);
  });

});