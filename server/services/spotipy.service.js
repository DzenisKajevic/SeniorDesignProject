const Playlist = require('../models/Playlist');
const AudioFile = require('../models/AudioFile');
const { StatusError } = require('../utils/helper.util');
const mongoose = require('mongoose');
const SpotipyInfo = require('../models/SpotipyInfo');
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyConfig = require('../configs/spotify.config.js');

/* // this function and updateVisibility could be merged into a single function, but that's not the priority currently.
async function updatePlaylistName(user, playlistId, playlistName) {
    let playlist = await Playlist.findOneAndUpdate({ '_id': playlistId, 'userId': user.userId }, { 'playlistName': playlistName }, { new: true });
    if (!playlist) {
        throw new StatusError(null, 'Playlist not found', 404);
    }
    console.log(playlist);
    return playlist;
};
 */

// used for testing route; delete later
const findSpotifySongID = async (res, next, songName) => {
    try {
        let spotifyApi = await getSpotifyInfoAccessToken();
        if (!spotifyApi) {
            next(new StatusError(null, `Error getting access token for the API`, 400));
        }
        const data = await spotifyApi.searchTracks(songName);
        console.log(data.body.tracks.items[0]);
        res.status(200).send(data.body.tracks.items[0]['id']);
    } catch (error) {
        console.log(error);
        next(new StatusError(error.message, `Error finding spotify song id`, 400));
    }
}

const findSpotifySongID2 = async (songName) => {
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

/* app.get('/spotify', async (req, res) => {
    const songName = req.query.songName;
    const song = await getSongFromSpotify(songName);
    res.send(song);
}); */

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
    findSpotifySongID2
}