const express = require('express');
const router = express.Router();
const spotipyController = require('../controllers/spotipy.controller');

// used for testing; delete later
router.get('/findSpotifySongID', spotipyController.findSpotifySongID);  //nece trebati, samo pozvati funkciju unutar SongFeatures
//2XpXDMRJiYLygz1rFQF6rc
/* router.get('/spotifySongFeatures', spotipyController.spotifySongFeatures); */

router.get('/callback', spotipyController.callback);

/* router.get('/useRefreshToken', spotipyController.useRefreshToken); */

router.get('/getNewAccessToken', spotipyController.getNewAccessToken);

router.get('/useRefreshToken', spotipyController.useRefreshToken);

/* app.get('/spotify', async (req, res) => {
    const songName = req.query.songName;
    const song = await getSongFromSpotify(songName);
    res.send(song);
}); */

/* app.get('/spotifySongFeatures', async (req, res) => {
    const songId = req.query.songId;
    const songFeatures = await spotifyApi.getAudioFeaturesForTrack(songId);
    res.send(songFeatures);
}); */

/* app.get('/callback', (req, res) => {
    const code = req.query.code;
    spotifyApi.authorizationCodeGrant(code).then((response) => {
        res.send(JSON.stringify(response));
        spotifyApi.setAccessToken(response.body['access_token']);
        spotifyApi.setRefreshToken(response.body['refresh_token']);
    });
}); */

/* app.get('/useRefreshToken', async function (req, res) {
    spotifyApi.refreshAccessToken().then(
        function (data) {
            console.log('The access token has been refreshed!');
            console.log(data.body);
            spotifyApi.setAccessToken(data.body['access_token']);
        },
        function (err) {
            console.log('Could not refresh access token', err);
        }
    );
}); */

/* router.get('/getAccessToken', (req, res) => {
    console.log(spotifyApi);
    res.redirect(spotifyApi.createAuthorizeURL(["user-read-private"]));
}); */

module.exports = router;