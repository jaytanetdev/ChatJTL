const mongoose = require('mongoose');
const RoomModal = require('../models/room-modal');

// ฟังก์ชันสำหรับเพิ่ม Room ใหม่
exports.insRoom = async (req, res) => {
    try {
        const newRoom = new RoomModal(req.body);
        await newRoom.save();
        res.status(201).json({ msg: "Save success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error saving message" });
    }
}
exports.updateRoom = async (req, res) => {
    try {
        var filter = { _id: new mongoose.Types.ObjectId(req.params.roomId) };

        const result = await RoomModal.updateOne(filter, { $set: req.body });
        res.status(200).json(result); // ส่งข้อมูล JSON กลับไปยัง client
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error saving message" });
    }
}


exports.getRoom = async (req, res) => {
    try {
        if(!req.query.status){
            return res.status(400).json({msg:"Please send status"})
        }
        const idUser = new mongoose.Types.ObjectId(req.params.idUser);
        const status = req.query.status;

        const search = req.query.search ? req.query.search : ''; // ค่าค้นหา
        const regexQuery = new RegExp(search, 'i'); // ใช้ Regular Expression สำหรับการค้นหาแบบไม่คำนึงถึงตัวพิมพ์เล็กหรือใหญ่
        
        const rooms = await RoomModal.aggregate([
            {
                $match: {
                    $or: [
                        { userIdSender: idUser },
                        { userIdReceiver: idUser }
                    ],
                    status: status
                }
            },
            {
                $addFields: {
                    joinUserId: {
                        $cond: {
                            if: { $eq: ["$userIdSender", idUser] },
                            then: "$userIdReceiver",
                            else: "$userIdSender"
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'joinUserId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $match: {
                    $or: [
                        { 'userDetails.name': { $regex: regexQuery } },
                        { 'userDetails.lastname': { $regex: regexQuery } }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'message_chats',
                    let: { joinUserId: '$joinUserId', roomId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$sendByUserId', '$$joinUserId'] },
                                        { $eq: ['$roomId', '$$roomId'] },
                                        { $eq: ['$read', false] }
                                    ]
                                }
                            }
                        },
                        {
                            $count: 'coutChatNoRead' // นับจำนวนเอกสารที่ตรงตามเงื่อนไข
                        }
                    ],
                    as: 'messageChatCount'
                }
            },
            {
                $unwind: {
                    path: '$messageChatCount',
                    preserveNullAndEmptyArrays: true // เพื่อให้ผลลัพธ์ยังคงมีเอกสารแม้ว่าไม่มีข้อมูลใน messageChatCount
                }
            },
            {
                $lookup: {
                    from: 'message_chats',
                    let: { roomId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$roomId', '$$roomId']
                                }
                            }
                        },
                        {
                            $sort: { timestamp: -1 }
                        },
                        {
                            $limit: 1
                        }
                    ],
                    as: 'lastChat'
                }
            },
            {
                $unwind: {
                    path: '$lastChat',
                    preserveNullAndEmptyArrays: true // เพื่อให้ผลลัพธ์ยังคงมีเอกสารแม้ว่าไม่มีข้อมูลใน lastChat
                }
            },
            {
                $sort: {
                    'lastChat.timestamp': -1
                }
            }
        ]);


        res.status(200).json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error retrieving rooms" });
    }
}
exports.checkUserReceiver = async (req, res) => {
    try {
        const roomId = new mongoose.Types.ObjectId(req.params.roomId);
        const idUser = new mongoose.Types.ObjectId(req.params.idUser);

        const rooms = await RoomModal.aggregate([
            {
                $match: {
                    $or: [
                        { userIdSender: idUser },
                        { userIdReceiver: idUser }
                    ],
                    _id: roomId
                }
            },
            {
                $addFields: {
                    joinUserId: {
                        $cond: {
                            if: { $eq: ["$userIdSender", idUser] },
                            then: "$userIdReceiver",
                            else: "$userIdSender"
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'joinUserId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },

            {
                $unwind: "$userDetails"
            }
        ]);




        res.status(200).json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error retrieving rooms" });
    }
}



exports.waitReceiveFriend = async (req, res) => {

    try {

        const idUser = new mongoose.Types.ObjectId(req.params.idUser);
        const rooms = await RoomModal.aggregate([
            {
                $match: {
                    userIdReceiver: idUser,
                    status: "0"
                }
            },
            {
                $count: "count"
            }
        ]);
        res.status(200).json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error retrieving friends" });
    }
}