// server/models/Message.js
const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    sendByUserId: {
        type: mongoose.Schema.Types.ObjectId,
         ref: 'user'
    },
    message: {
        type: String,
    },
    read: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    lastUpstamp: {
        type: Date,
        default: Date.now,
    },
    readTime: {
        type: Date,
    },
});

Schema.pre('updateMany', function (next) {
    const update = this.getUpdate();

    // // ตรวจสอบว่า '$set' มีการตั้งค่า read เป็น true หรือไม่
    if (update.$set && update.$set.read === true) {
        // ใช้ `update` เพื่อกำหนดค่าฟิลด์ `readTime`

        update.$set.readTime = new Date();
        update.$set.lastUpstamp = new Date();
    }
    next();
});
module.exports = mongoose.model('message_chat', Schema);
