const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const generalConfig = require('../configs/general.config');
const dbConnection = require('../utils/db.service');

/* Connecting to the database before each test. */
beforeEach(async () => {
    await dbConnection.connect();
});

/* Closing database connection after each test. */
afterEach(async () => {
    await dbConnection.closeConnection();
});

describe("GET /api/v1/auth/register", () => {
    it("should return all products", async () => {
        const registerInput = {
            username: "TestUser2",
            email: "TestUser2@gmail.com",
            password: "TestUser2_123"
        }
        const res = await request(app).post("/api/v1/auth/register").send(registerInput);
        console.log(res.error);
        console.log(res.statusCode);
        console.log(res.body);
        expect(res.statusCode).toBe(201);
        expect(res.body.registeredUser.email === registerInput.email).toBeTruthy();
        expect('_id' in res.body.registeredUser).toBeTruthy();
    });
});