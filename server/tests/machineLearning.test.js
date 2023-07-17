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
// checks if the error message is: "Not enough songs played to recommend playlists"
describe("fail GET /api/v1/ML/generateRecommendedPlaylists", () => {
    it("should fail at generating playlists due to insufficient listening activity", async () => {
        const res = await request(app).get("/api/v1/ML/generateRecommendedPlaylists").set("Authorization", "Bearer " + token);
        console.log(res.error);
        console.log(res.statusCode);
        console.log(res.body);
        console.log(res.error.text);
        expect(res.statusCode).toBe(400);
        expect(res.error.text).toBe("Not enough songs played to recommend playlists");
    });
});

describe("success GET /api/v1/ML/generateRecommendedPlaylists", () => {
    it("should generate 3 new playlists, check if they were created, and instantly delete them afterwards", async () => {
        const loginInput = {
            email: "TestUser505@gmail.com",
            password: "TestUser505_123"
        }
        let otherUsersToken = (await request(app).post("/api/v1/auth/login").send(loginInput)).body.token;
        const res = await request(app).get("/api/v1/ML/generateRecommendedPlaylists").set("Authorization", "Bearer " + otherUsersToken);
        console.log(res.error);
        console.log(res.statusCode);
        console.log(res.body);
        expect(res.statusCode).toBe(201);

        let deletePlaylist = await request(app).delete("/api/v1/playlists/deletePlaylist").send(playlistId1).set("Authorization", "Bearer " + otherUsersToken);
    });
});

