const mongoose = require('mongoose');

const SongFeaturesSchema = new mongoose.Schema({
    songId: {
        type: String,
        required: true,
        unique: true
    },
    danceability: {
        type: Number,
        required: true
    },
    energy: {
        type: Number,
        required: true
    },
    acousticness: {
        type: Number,
        required: true
    },
    valence: {
        type: Number,
        required: true
        //unique: true // this doesn't prevent GridFS from uploading files with the same name...
    },
    tempo: {
        type: Number,
        required: true
    },
    instrumentalness: {
        type: Number,
        required: true
    }
}, { versionKey: false });

module.exports = mongoose.model("SongFeatures", SongFeaturesSchema, 'songFeatures');