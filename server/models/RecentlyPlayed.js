const mongoose = require('mongoose');
const validator = require('validator');
const AudioFile = require('./AudioFile');
const User = require('./User');

const RecentlyPlayedSongSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: [true, 'User ID can\'t be empty'],
    },
    fileId: {
        type: mongoose.Types.ObjectId,
        ref: 'AudioFile',
        required: [true, 'File ID can\'t be empty'],
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { strictQuery: true });
/* 
RecentlyPlayedSongsSchema.on('index', function (err) {
    if (err) {
        console.error('User index error: %s', err);
    } else {
        console.info('User indexing complete');
    }
}); */

//RecentlyPlayedSchema.index({ userId: 1, fileId: 1 }, { unique: true });

module.exports = mongoose.model("RecentlyPlayedSong", RecentlyPlayedSongSchema, 'recentlyPlayedSongs');