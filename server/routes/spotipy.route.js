const express = require('express');
const router = express.Router();
const spotipyController = require('../controllers/spotipy.controller');

router.get('/callback', spotipyController.callback);

router.get('/getNewAccessToken', spotipyController.getNewAccessToken);

/* router.get('/useRefreshToken', spotipyController.useRefreshToken); */

module.exports = router;