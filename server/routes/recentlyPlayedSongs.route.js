const express = require('express');
const router = express.Router();
const recentlyPlayedSongsController = require('../controllers/recentlyPlayedSongs.controller');

// adds a file to the user's recently played songs list
/** 
 * @swagger
 * /api/v1/favouriteFiles/addToRecentlyPlayedSongs:
 *   post:
 *     tags:
 *      - recently played songs
 *     operationId: addToRecentlyPlayedSongs
 *     description: Add a file to your list of recently played songs
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     requestBody:
 *      content:
 *       application/x-www-form-urlencoded:
 *        schema:
 *          type: object
 *          properties:
 *           fileId:
 *            example: 6311f239d67a5113d40edd4c
 *            description: ID of the requested file
 *            required: true
 *            type: string
 *     responses:
 *       201:
 *         description: File successfully added to recently played songs
 */
router.post('/addToRecentlyPlayedSongs', recentlyPlayedSongsController.addToRecentlyPlayedSongs);


// retrieves the user's fav files
/** 
* @swagger
*  /api/v1/favouriteFiles/getRecentlyPlayedSongs: 
*   get: 
*    tags:
*      - recently played songs
*    operationId: getRecentlyPlayedSongs
*    security:
*       - bearerAuth: []
*    description: Used to fetch a page of the user's recently played songs
*    responses: 
*      200: 
*          description: Successful response
*      401: 
*          description: Missing authorization
*      404:
*          description: No files available
*/
router.get('/getRecentlyPlayedSongs', recentlyPlayedSongsController.getRecentlyPlayedSongs);

module.exports = router;
