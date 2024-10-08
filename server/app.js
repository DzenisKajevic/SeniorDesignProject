const cors = require('cors')


const generalConfig = require('./configs/general.config');
const usersAuthRouter = require('./routes/usersAuth.route');
const notificationsRouter = require('./routes/notifications.route');
const audioFilesRouter = require('./routes/audioFiles.route');
const favouriteFilesRouter = require('./routes/favouriteFiles.route');
const playlistsRouter = require('./routes/playlists.route');
const spotifyRouter = require('./routes/spotipy.route');
const profilePicRouter = require('./routes/profilePics.routes');
const machineLearningRouter = require('./routes/machineLearning.route');
const recentlyPlayedSongsRouter = require('./routes/recentlyPlayedSongs.route');
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
    res.send('Hello World!');
});

// route middleware
app.use('/api/v1/spotify', spotifyRouter);
app.use('/api/v1/auth', usersAuthRouter);
app.use('/api/v1/audioFiles', audioFilesRouter);
app.use('/api/v1/profilePics', profilePicRouter);
app.use('/api/v1/favouriteFiles', favouriteFilesRouter);
app.use('/api/v1/playlists', playlistsRouter);
app.use('/api/v1/notifications', notificationsRouter);
app.use('/api/v1/recentlyPlayedSongs', recentlyPlayedSongsRouter);
app.use('/api/v1/ML', machineLearningRouter);

// error handler middleware
app.use(middleware.handleErrors);

// used for giving unique IDs to requests for logging
function assignId(req, res, next) {
    req.id = uuidv4();
    next();
}

module.exports = app;