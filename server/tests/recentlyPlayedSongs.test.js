const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const generalConfig = require('../configs/general.config');
const dbConnection = require('../utils/db.service');
const fileId = "649ab97c1759d624cb205270";
let token = null;


//setup and teardown
beforeAll(async () => {
    await dbConnection.connect();
    const loginInput = {
        email: "TestUser2@gmail.com",
        password: "TestUser2_123"
    }
    token = (await request(app).post("/api/v1/auth/login").send(loginInput)).body.token;
});

afterAll(async () => {
    await dbConnection.closeConnection();
});

//passes
// adds a file to the recents and checks if the fileId matches
describe("POST /api/v1/recentlyPlayedSongs/addToRecentlyPlayedSongs", () => {
    it("should add a song to the recently listened songs", async () => {
        /* const songIds = [
            "649ae784b650c0f81e7de9d8", //lifetime
            "649ae8bdb650c0f81e7deabc", //hero
            "64ac30c68165746a447a6b54", //Mr. Forgettable
        ]; */
        const fileId = "649ae784b650c0f81e7de9d8";
        const res = await request(app).post("/api/v1/recentlyPlayedSongs/addToRecentlyPlayedSongs").send({ fileId: fileId }).set("Authorization", "Bearer " + token);
        console.log(res.error);
        console.log(res.statusCode);
        console.log(res.body);
        expect(res.statusCode).toBe(201);
        expect(res.body.fileId).toBe(fileId);
    });
});
