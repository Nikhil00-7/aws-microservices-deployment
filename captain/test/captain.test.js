const request = require('supertest');
const express = require('express');

const captainController = require('../controllers/captain.controller');


jest.mock('../models/captain.model');
const captainModel = require('../models/captain.model');

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
  req.captain = { _id: "captain123", name: "Captain Jack" };
  next();
});


app.post('/register', captainController.register);
app.post('/login', captainController.login);
app.post('/logout', captainController.logout);
app.get('/profile', captainController.profile);
app.post('/toggle', captainController.toggleAvailability);
app.get('/wait-ride', captainController.waitForNewRide);


beforeEach(() => {
  jest.clearAllMocks();
});



describe("Captain Register", () => {

  it("should register new captain", async () => {

    captainModel.findOne = jest.fn().mockResolvedValue(null);
    bcrypt.hash = jest.fn().mockResolvedValue("hashed");

    captainModel.prototype.save = jest.fn().mockResolvedValue({
      _id: "captain123",
      name: "Jack",
      email: "test@test.com",
      _doc: { password: "hashed" }
    });

    jwt.sign = jest.fn().mockReturnValue("token123");

    const res = await request(app)
      .post('/register')
      .send({
        name: "Jack",
        email: "test@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(jwt.sign).toHaveBeenCalled();
  });

  it("should fail if captain exists", async () => {

    captainModel.findOne = jest.fn().mockResolvedValue({ email: "test@test.com" });

    const res = await request(app)
      .post('/register')
      .send({
        name: "Jack",
        email: "test@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("captain already exists");
  });

});



describe("Captain Login", () => {

  it("should login captain", async () => {

    const mockCaptain = {
      _id: "captain123",
      password: "hashed",
      _doc: { password: "hashed" }
    };

    captainModel.findOne = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue(mockCaptain)
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

  it("should fail if captain not found", async () => {

    captainModel.findOne = jest.fn().mockReturnValue({
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



describe("Captain Logout", () => {

  it("should logout captain", async () => {

    blacklisttokenModel.create = jest.fn().mockResolvedValue(true);

    const res = await request(app).post('/logout');

    expect(res.statusCode).toBe(200);
    expect(blacklisttokenModel.create).toHaveBeenCalledWith({
      token: "test-token"
    });
  });

});



describe("Captain Profile", () => {

  it("should return captain profile", async () => {

    const res = await request(app).get('/profile');

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe("captain123");
  });

});



describe("Toggle Availability", () => {

  it("should toggle availability", async () => {

    const mockCaptain = {
      _id: "captain123",
      isAvailable: false,
      save: jest.fn().mockResolvedValue(true)
    };

    captainModel.findById = jest.fn().mockResolvedValue(mockCaptain);

    const res = await request(app).post('/toggle');

    expect(res.statusCode).toBe(200);
    expect(mockCaptain.isAvailable).toBe(true);
  });

});



describe("Wait For New Ride", () => {

  it("should return 204 after timeout", async () => {

    const res = await request(app).get('/wait-ride');

    expect([200, 204]).toContain(res.statusCode);
  });

});