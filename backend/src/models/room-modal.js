const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    userIdSender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    userIdReceiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String
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

module.exports = mongoose.model('room', Schema);
