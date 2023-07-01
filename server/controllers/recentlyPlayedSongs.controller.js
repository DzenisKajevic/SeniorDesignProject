const recentlyPlayedSongsService = require('../services/recentlyPlayedSongs.service');
const { StatusError } = require('../utils/helper.util');
const helperUtil = require('../utils/helper.util');

async function addToRecentlyPlayedSongs(req, res, next) {
    try {
        //console.log(req.user);
        // this will also check if the song is already there. If it is, it will just update the timestamp
        res.status(201).send(await recentlyPlayedSongsService.addToRecentlyPlayedSongs(req.user.userId, req.body.fileId));
    } catch (err) {
        console.error(`Error adding file to recents\n`, err);
        next(new StatusError(err.message, `Error adding file to recents`, 500));
    }
}

async function getRecentlyPlayedSongs(req, res, next) {
    try {
        res.status(200).send(await recentlyPlayedSongsService.getRecentlyPlayedSongs(req.user.userId, req.query));
    } catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }

        console.error(`Error fetching file info\n`, err);
        next(new StatusError(err.message, `Error fetching favourite files`, 500));
    }
}

/* // might use this to clear the recents list 
async function deleteFavouriteFile(req, res, next) {
    try {
        res.status(200).send(await favouriteFilesService.deleteFavouriteFile(req.user.userId, req.body.fileId));
    } catch (err) {
        if (err.name === 'StatusError') {
            console.log(err);
            return res.status(err.statusCode).send(err.additionalMessage);
        }
        console.error(`Error deleting favourite file\n`, err);
        next(new StatusError(err.message, `Error deleting favourite file`, 500));
    }
};
 */
module.exports = {
    addToRecentlyPlayedSongs,
    getRecentlyPlayedSongs,
    //deleteFavouriteFile,
};