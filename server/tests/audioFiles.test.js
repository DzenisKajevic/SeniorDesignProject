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
// check if it passes (buffer is returned)
describe("GET /api/v1/audioFiles/getFile/:fileId", () => {
    it("should return a song", async () => {
        const res = await request(app).get("/api/v1/audioFiles/getFile/" + fileId).set("Authorization", "Bearer " + token);
        console.log(res.error);
        console.log(res.statusCode);
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        // the file is returned as a buffer, so we can't check the content
    });
});

// passes
// check if song's name is "Lost"
// check if IDs match
describe("GET /api/v1/audioFiles/getRecentlyPlayedSongs", () => {
    it("should return a song's info", async () => {
        const res = await request(app).get("/api/v1/audioFiles/getFileInfo/" + fileId).set("Authorization", "Bearer " + token);
        console.log(res.error);
        console.log(res.statusCode);
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body._id === fileId).toBeTruthy();
        expect(res.body.metadata.songName === "Lost").toBeTruthy();
    });
});

// passes
// check if genres.length > 0
describe("GET /api/v1/audioFiles/getAllGenres", () => {
    it("should return all genres", async () => {
        const res = await request(app).get("/api/v1/audioFiles/getAllGenres").set("Authorization", "Bearer " + token);
        console.log(res.error);
        console.log(res.statusCode);
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.genres.length > 0).toBeTruthy();
    });
});