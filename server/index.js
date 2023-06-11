// might install Joi -> used for validating data

// cd node_modules\.bin
// jshint ../../index.js
const cors = require('cors')


const generalConfig = require('./configs/general.config');
const dbConnection = require('./utils/db.service');
const usersAuthRouter = require('./routes/usersAuth.route');
const notificationsRouter = require('./routes/notifications.route');
const audioFilesRouter = require('./routes/audioFiles.route');
const favouriteFilesRouter = require('./routes/favouriteFiles.route');
const playlistsRouter = require('./routes/playlists.route');
const profilePicRouter = require('./routes/profilePics.routes');
const middleware = require('./middleware/middleware');
const { morgan } = require('./utils/helper.util');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require("body-parser");
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyConfig = require('./configs/spotify.config');
const { default: axios } = require('axios');
const { resolve } = require('./utils/resolver');


app.use(cors()) // Use this after the variable declaration

console.log(`${__dirname}`)
console.log(`${generalConfig.host}:${generalConfig.expressPort}`);
const swaggerOptions = {
    //explorer: true,
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            //basePath: "/api/v1",
            title: 'Music App API',
            description: 'Developer API',
            contact: {
                name: "Dženis Kajević"
            },
            servers: {
                url: `http://${generalConfig.host}:${generalConfig.expressPort}/api/v1`,
                description: 'Development server',
            }
        },
        host: `${generalConfig.host}:${generalConfig.expressPort}`, // Host (optional)
        basePath: '/api/v1'
    },
    apis: ['./routes/*.js', './index.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
//explorer = search bar
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs, { explorer: true }));

mongoose.set('debug', true);
app.use(express.json());

// creates a file for logs
let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// logs requestsapp.use(morgan(':timestamp reqId: :id userToken: :userJWTToken :remote-addr :http-version :method :url :status :total-time'));
// changes output location to the file
app.use(morgan(':timestamp reqId: :id userToken: :userJWTToken :remote-addr :http-version :method :url :status Error: :fetchError :total-time', { stream: accessLogStream }));
//app.use(morgan(':timestamp reqId: :id userToken: :userJWTToken :remote-addr :http-version :method :url :status Error: :fetchError :total-time'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(assignId);

app.all('*', middleware.JWTAuth);

/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth: # arbitrary name for the security scheme
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 */

/**
 * @swagger
 * /:
 *   get:
 *     description: Returns the homepage
 *     responses:
 *       200:
 *         description: hello world
 */
app.get('/', (req, res) => {
    console.log(spotifyApi);
    res.redirect(spotifyApi.createAuthorizeURL(["user-read-private"]));
});

app.get('/test', async (req, res) => {
    var AUTH_URL = 'https://accounts.spotify.com/api/token';
    var result = await resolve(
        axios({
            method: 'post',
            url: AUTH_URL,
            data: {
                'scope': 'user-read-private',
                'client_id': spotifyConfig.SPOTIPY_CLIENT_ID,
                'client_secret': spotifyConfig.SPOTIPY_CLIENT_SECRET,
            }
        }));
    console.log(result);
    /*     auth_response = request.post(AUTH_URL, {
            'grant_type': 'client_credentials',
            'client_id': spotifyConfig.SPOTIPY_CLIENT_ID,
            'client_secret': spotifyConfig.SPOTIPY_CLIENT_SECRET,
        })
        auth_response_data = auth_response.json()
        access_token = auth_response_data['access_token']
        console.log(access_token);
     */
});

app.get('/useRefreshToken', async function (req, res) {
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
});

var spotifyApi = new SpotifyWebApi({
    clientId: spotifyConfig.SPOTIPY_CLIENT_ID,
    clientSecret: spotifyConfig.SPOTIPY_CLIENT_SECRET,
    redirectUri: spotifyConfig.SPOTIPY_REDIRECT_URI
});

const getSongFromSpotify = async (songName) => {
    try {
        const data = await spotifyApi.searchTracks(songName);
        console.log(data.body.tracks.items[0]);
        return data.body.tracks.items[0];
    } catch (error) {
        console.log(error);
    }
}

app.get('/spotify', async (req, res) => {
    const songName = req.query.songName;
    const song = await getSongFromSpotify(songName);
    res.send(song);
});

app.get('/spotifySongFeatures', async (req, res) => {
    const songId = req.query.songId;
    const songFeatures = await spotifyApi.getAudioFeaturesForTrack(songId);
    res.send(songFeatures);
});

app.get('/callback', (req, res) => {
    const code = req.query.code;
    spotifyApi.authorizationCodeGrant(code).then((response) => {
        res.send(JSON.stringify(response));
        spotifyApi.setAccessToken(response.body['access_token']);
        spotifyApi.setRefreshToken(response.body['refresh_token']);
    });
});

// route middleware
app.use('/api/v1/auth', usersAuthRouter);
app.use('/api/v1/audioFiles', audioFilesRouter);
app.use('/api/v1/profilePics', profilePicRouter);
app.use('/api/v1/favouriteFiles', favouriteFilesRouter);
app.use('/api/v1/playlists', playlistsRouter);
app.use('/api/v1/notifications', notificationsRouter);

// error handler middleware
app.use(middleware.handleErrors);

// used for giving unique IDs to requests for logging
function assignId(req, res, next) {
    req.id = uuidv4();
    next();
}

const start = async () => {
    try {
        const port = generalConfig.expressPort;
        app.listen(port, () => console.log(`Listening on port ${port}.`));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

    try {
        await dbConnection.connect();
    }
    catch (error) {
        console.log(error);
    }
};
start();