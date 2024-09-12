const MessageModal = require('../models/message-modal');
const mongoose = require('mongoose');
exports.insChatMassage = async (req, res) => {
    try {
        const newMessage = new MessageModal(req.body); // สร้าง instance ใหม่ของ MessageModal ด้วยข้อมูลจาก req.body
        await newMessage.save(); // บันทึกข้อมูลลงฐานข้อมูล
        res.status(201).json({ msg: "Save success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error saving message" });
    }
};

exports.getChatMassage = async (req, res) => {
    try {
        const messages = await MessageModal.find({ roomId: req.params.roomId })
            .sort({ timeStamp: 1 })
        res.status(200).json(messages); // ส่งข้อมูล JSON กลับไปยัง client
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error retrieving messages" }); // ส่งข้อความแจ้งเตือนเมื่อเกิดข้อผิดพลาด
    }
};
exports.updateChatMessage = async (req, res) => {
    try {
        var filter = { roomId: new mongoose.Types.ObjectId(req.params.roomId), read: { $ne: true } };

        if (req.params.sendByUserId === "eq") {
            filter.sendByUserId = { $eq: new mongoose.Types.ObjectId(req.params.userId) }
        } else if (req.params.sendByUserId === "ne") {
            filter.sendByUserId = { $ne: new mongoose.Types.ObjectId(req.params.userId) }
        }

        const result = await MessageModal.updateMany(filter, { $set: req.body } );

        res.status(200).json(result); // ส่งข้อมูล JSON กลับไปยัง client
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error retrieving messages" }); // ส่งข้อความแจ้งเตือนเมื่อเกิดข้อผิดพลาด
    }
};
