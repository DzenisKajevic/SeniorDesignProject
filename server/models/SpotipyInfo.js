const mongoose = require('mongoose');
const User = require('./User');

const SpotipyInfoSchema = new mongoose.Schema({
    accessToken: {
        type: String,
        required: true,
        default: false
    },
    refreshToken: {
        type: String,
        required: true
    },
    validUntilTimestamp: { /* Date.now() + 3600 * 1000 */
        type: Number,
        required: true
    },
}, { strictQuery: false });


module.exports = mongoose.model("SpotipyInfo", SpotipyInfoSchema, 'spotipyInfo');