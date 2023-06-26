const spotipyService = require('../services/spotipy.service');
const { StatusError } = require('../utils/helper.util');

// used for testing route; delete later
async function findSpotifySongID(req, res, next) {
    try {
        const songName = req.query.songName;
        await spotipyService.findSpotifySongID(res, next, songName);
    }
    catch (err) {
        console.error(`Error getting song id\n`, err);
        return null;
    }
};
async function findSpotifySongID2(songName) {
    try {
        return await spotipyService.findSpotifySongID2(songName);
    }
    catch (err) {
        console.error(`Error getting song id\n`, err);
        return null;
    }
};

async function spotifySongFeatures(songId) {
    try {
        return await spotipyService.getAudioFeaturesForTrack(songId);
        /*         const songFeatures = await spotifyApi.getAudioFeaturesForTrack(songId);
                return songFeatures; */
    } catch (err) {
        console.error(`Error getting song features\n`, err);
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
    findSpotifySongID2,
    spotifySongFeatures,
    getNewAccessToken,
    useRefreshToken
}