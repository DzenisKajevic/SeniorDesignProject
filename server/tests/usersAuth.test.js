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

//passes
describe("POST /api/v1/auth/register", () => {
    it("should register a new user", async () => {
        const randomNumber = Math.floor(Math.random() * 1000);
        const registerInput = {
            username: "TestUser" + randomNumber,
            email: "TestUser" + randomNumber + "@gmail.com",
            password: "TestUser" + randomNumber + "_123"
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

//passes
describe("POST /api/v1/auth/login", () => {
    it("should login a user", async () => {
        const loginInput = {
            email: "TestUser2@gmail.com",
            password: "TestUser2_123"
        }
        const res = await request(app).post("/api/v1/auth/login").send(loginInput);
        console.log(res.error);
        console.log(res.statusCode);
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.loginUser.email === loginInput.email).toBeTruthy();
        expect('_id' in res.body.loginUser).toBeTruthy();
    });
});

//passes
describe("PUT /api/v1/auth/renameUser", () => {
    it("should rename a user", async () => {
        const loginInput = {
            email: "TestUser2@gmail.com",
            password: "TestUser2_123"
        }
        const token = (await request(app).post("/api/v1/auth/login").send(loginInput)).body.token;
        const randomNumber = Math.floor(Math.random() * 1000);
        const renameUserInput = {
            email: "TestUser2@gmail.com",
            password: "TestUser2_123",
            newUsername: "TestUser2Renamed" + randomNumber
        }
        const res = await request(app).put("/api/v1/auth/renameUser").send(renameUserInput).set("Authorization", "Bearer " + token);
        console.log(res.error);
        console.log(res.statusCode);
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.username === renameUserInput.newUsername).toBeTruthy();
    });
});
