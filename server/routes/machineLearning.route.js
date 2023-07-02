const express = require('express');
const router = express.Router();
const machineLearningController = require('../controllers/machineLearning.controller');

// generates 3 recommended playlists for the user based on their recently played songs
/** 
* @swagger
*  /api/v1/ML/generateRecommendedPlaylists: 
*   get: 
*    tags:
*      - machine learning
*    operationId: generateRecommendedPlaylists
*    security:
*       - bearerAuth: []
*    description: Used to generate 3 playlists for the user based on their recently played songs
*    responses: 
*      200: 
*          description: Successful response
*      401: 
*          description: Missing authorization
*      500:
*          description: Unable to generate playlists
*/
router.get('/generateRecommendedPlaylists', machineLearningController.generateRecommendedPlaylists);

module.exports = router;
