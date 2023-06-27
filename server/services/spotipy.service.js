const Playlist = require('../models/Playlist');
const AudioFile = require('../models/AudioFile');
const { StatusError } = require('../utils/helper.util');
const mongoose = require('mongoose');
const SpotipyInfo = require('../models/SpotipyInfo');
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyConfig = require('../configs/spotify.config.js');


const findSpotifySongFeatures = async (songId) => {
    try {
        let spotifyApi = await getSpotifyInfoAccessToken();
        if (!spotifyApi) {
            console.log("Error getting access token for the API");
            return null;
        }
        const data = await spotifyApi.getAudioFeaturesForTrack(songId);
        return data.body;
    } catch (error) {
        console.log(error);
        console.log("Error finding spotify song features");
    }
}

const findSpotifySongID = async (songName) => {
    try {
        let spotifyApi = await getSpotifyInfoAccessToken();
        if (!spotifyApi) {
            console.log("Error getting access token for the API");
            return null;
            /* next(new StatusError(null, `Error getting access token for the API`, 400)); */
        }
        const data = await spotifyApi.searchTracks(songName);
        console.log(data.body.tracks.items[0]['id']);
        return data.body.tracks.items[0]['id'];
    } catch (error) {
        console.log(error);
        console.log("Error finding spotify song id");
    }
}

async function callback(res, next, code) {
    let spotifyApi = createApiObject();
    spotifyApi.authorizationCodeGrant(code).then(async function (response) {
        /*         spotifyApi.setAccessToken(response.body['access_token']);
                spotifyApi.setRefreshToken(response.body['refresh_token']); */
        let spotipyInfo = await SpotipyInfo.findOneAndUpdate({}, { 'accessToken': response.body['access_token'], 'refreshToken': response.body['refresh_token'], 'validUntilTimestamp': Date.now() + response.body['expires_in'] * 1000 }, { upsert: true });
        if (!spotipyInfo) {
            next(new StatusError(null, `Error saving tokens`, 400));
        }
        res.status(201).send(spotipyInfo);
    })
        .catch((error) => {
            next(new StatusError(error.message, `Error getting access token`, 400));
        });
};

async function getNewAccessToken(res) {
    let spotifyApi = createApiObject();
    res.redirect(spotifyApi.createAuthorizeURL(["user-read-private"]));
}

async function getSpotifyInfoAccessToken() {
    let spotifyApi = createApiObject();
    let spotipyInfo = await SpotipyInfo.findOne({});
    if (!spotipyInfo) {
        console.log("No spotipyInfo found");
        return null;
    }
    if (spotipyInfo.validUntilTimestamp < Date.now()) {
        spotifyApi = useRefreshToken();
        if (!spotifyApi) {
            return null;
        }
        return spotifyApi;
    }
    else {
        spotifyApi.setAccessToken(spotipyInfo.accessToken);
        return spotifyApi;
    }

}

async function useRefreshToken() {
    let spotifyApi = createApiObject();
    let spotipyInfo = await SpotipyInfo.findOne({});
    spotifyApi.setRefreshToken(spotipyInfo.refreshToken);
    spotifyApi = await spotifyApi.refreshAccessToken().then(
        async function (data) {
            console.log('The access token has been refreshed!');
            spotifyApi.setAccessToken(data.body['access_token']);
            let spotipyInfo = await SpotipyInfo.findOneAndUpdate({}, { 'accessToken': data.body['access_token'], 'validUntilTimestamp': Date.now() + data.body['expires_in'] * 1000 }, { upsert: true });
            if (!spotipyInfo) {
                return null;
            }
            console.log(spotifyApi);
            return spotifyApi;
        },
        function (err) {
            console.log(err);
            return null;
        }
    );
    return spotifyApi;
}

function createApiObject() {
    var spotifyApi = new SpotifyWebApi({
        clientId: spotifyConfig.SPOTIPY_CLIENT_ID,
        clientSecret: spotifyConfig.SPOTIPY_CLIENT_SECRET,
        redirectUri: spotifyConfig.SPOTIPY_REDIRECT_URI
    });
    return spotifyApi;
}
module.exports = {
    callback,
    getNewAccessToken,
    useRefreshToken,
    findSpotifySongID,
    findSpotifySongFeatures
}