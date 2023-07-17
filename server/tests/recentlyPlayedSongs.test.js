const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const generalConfig = require('../configs/general.config');
const dbConnection = require('../utils/db.service');
let fileId = null;
let token = null;


//setup and teardown
beforeAll(async () => {
    await dbConnection.connect();
    const loginInput = {
        email: "TestUser2@gmail.com",
        password: "TestUser2_123"
    }
    token = (await request(app).post("/api/v1/auth/login").send(loginInput)).body.token;
    fileId = "649ae784b650c0f81e7de9d8";
});

afterAll(async () => {
    await dbConnection.closeConnection();
});

//passes
// adds a file to the recents and checks if the fileId matches
describe("POST /api/v1/recentlyPlayedSongs/addToRecentlyPlayedSongs", () => {
    it("should add a song to the recently listened songs", async () => {
        const res = await request(app).post("/api/v1/recentlyPlayedSongs/addToRecentlyPlayedSongs")
            .send({ fileId: fileId })
            .set("Authorization", "Bearer " + token);
        expect(res.statusCode).toBe(201);
        expect(res.body.fileId).toBe(fileId);
    });
    it("should return recently played songs", async () => {
        const res = await request(app).get("/api/v1/recentlyPlayedSongs/getRecentlyPlayedSongs")
            .set("Authorization", "Bearer " + token);

        expect(res.statusCode).toBe(200);
        expect(res.body.recents[0].fileId._id === fileId).toBeTruthy();
    });
});

/* describe("GET /api/v1/recentlyPlayedSongs/getRecentlyPlayedSongs", () => {
    it("should return recently played songs", async () => {
        const res = await request(app).get("/api/v1/recentlyPlayedSongs/getRecentlyPlayedSongs").set("Authorization", "Bearer " + token);
        console.log(res.error);
        console.log(res.statusCode);
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.recents.length > 0).toBeTruthy();
    });
}); */