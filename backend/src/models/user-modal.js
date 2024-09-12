const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    urlPic: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    lastUpstamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('user', Schema);
