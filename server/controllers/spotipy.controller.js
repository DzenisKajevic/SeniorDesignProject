const spotipyService = require('../services/spotipy.service');
const { StatusError } = require('../utils/helper.util');

const findSpotifySongFeatures = async (songId) => {
    try {
        return await spotipyService.findSpotifySongFeatures(songId);
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function findSpotifySongID(songName) {
    try {
        return await spotipyService.findSpotifySongID(songName);
    }
    catch (err) {
        console.error(`Error getting song id\n`, err);
        return null;
    }
};

async function callback(req, res, next) {
    const code = req.query.code;
    let spotipyInfo = await spotipyService.callback(res, next, code);
    //res.status(201).send(spotipyInfo);
};

async function useRefreshToken(req, res, next) {
    await spotipyService.useRefreshToken(res, next);
};

async function getNewAccessToken(req, res, next) {
    try {
        res.status(200).send(await spotipyService.getAccessToken(res));
    } catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.error(`Error getting access token\n`, err);
        next(new StatusError(err.message, `Error getting access token`, 500));
    }
};

module.exports = {
    callback,
    findSpotifySongID,
    findSpotifySongFeatures,
    getNewAccessToken,
    useRefreshToken
}