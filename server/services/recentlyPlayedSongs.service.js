const AudioFile = require('../models/AudioFile');
const RecentlyPlayedSong = require('../models/RecentlyPlayed');
const { StatusError } = require('../utils/helper.util');

async function addToRecentlyPlayedSongs(userId, fileId) {
    const file = await AudioFile.findOne({ '_id': fileId, 'reviewed': true });
    if (file) {
        let recentlyPlayedSong = await RecentlyPlayedSong.findOne({ 'userId': userId, 'fileId': fileId });
        if (recentlyPlayedSong) {
            // update timestamp
            recentlyPlayedSong.timestamp = Date.now();
            await recentlyPlayedSong.save();
        }
        else {
            const count = await RecentlyPlayedSong.count({ 'userId': userId });
            console.log("COUNT", count, count >= 20);
            if (count >= 20) {
                console.log("deleting");
                // delete the oldest one
                await RecentlyPlayedSong.remove({ 'userId': userId }).sort({ 'timestamp': 1 }).limit(1);
            }
            recentlyPlayedSong = await RecentlyPlayedSong.create({
                userId: userId,
                fileId: fileId
            });
        }
        recentlyPlayedSong.userId = undefined;
        delete recentlyPlayedSong.userId;
        return recentlyPlayedSong;
    }
    throw new StatusError(null, 'Can\'t add non-existing file to recents', 500);
}

async function getRecentlyPlayedSongs(userId) {
    /*     page = parseInt(page) || 1;
        pageSize = parseInt(pageSize) || 4; */

    // for now, this line is useless, since the userId is extracted from the JWT. Recently played songs are private for now
    if (!userId || userId === 'undefined') throw new StatusError(undefined, 'User ID was not provided', 422);


    /* let favouritesCount = await FavouriteFile.count({ 'userId': userId }); */
    //const files = await FavouriteFile.find({ 'userId': userId }).skip((page - 1) * pageSize).limit(pageSize).populate('fileId');
    const files = await RecentlyPlayedSong.find({ 'userId': userId }).sort({ 'timestamp': -1 }).populate('fileId');
    if (!files || files.length === 0) {
        throw new StatusError(null, 'No files available', 404);
    }
    files.forEach(function (file, index) {
        this[index].userId = undefined;
        delete this[index].userId;
    }, files);

    let returnObject = {
        'recents': files,
        /* 'pageCount': Math.ceil(favouritesCount / pageSize) */
    }

    return returnObject;
};

/* async function deleteFavouriteFile(userId, fileId) {
    const file = await FavouriteFile.deleteOne({ 'userId': userId, 'fileId': fileId });
    if (!file.deletedCount) throw new StatusError(null, 'Error: Nothing was deleted', 500);
    return "Successfully deleted file from favourites";
};
 */

module.exports = {
    addToRecentlyPlayedSongs,
    getRecentlyPlayedSongs,
    //    deleteFavouriteFile
};