const jwt = require('jsonwebtoken');
const UserModal = require('../models/user-modal');
const mongoose = require('mongoose');
exports.insUser = async (req, res) => {
    try {
        const newUser = new UserModal(req.body);
        await newUser.save();
        res.status(201).json({ msg: "Save success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: error.message });
    }
}
exports.getCheckRegister = async (req, res) => {
    try {
        let User = await UserModal.find({ username: req.query.username });
        if (User.length > 0) {
            res.status(200).json(false);
        } else {
            res.status(200).json(true);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error retrieving messages" });
    }
}
exports.getUser = async (req, res) => {
    if (!req.query.username || !req.query.password) {
        return res.status(404).json({ msg: "Please send username and password" });
    }
    try {
        let User = await UserModal.find({
            username: req.query.username,
            password: req.query.password
        });

        let data = {};
        if (User.length > 0) {
            data._id = User[0]._id;
            data.name = User[0].name;
            data.lastname = User[0].lastname;
            data.urlPic = User[0].urlPic;
            res.status(200).json(data);
        } else {
            res.status(200).json(false);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error retrieving messages" });
    }
}

exports.getUserFriend = async (req, res) => {
    const idUser = new mongoose.Types.ObjectId(req.params.idUser);
    try {
        let User = await UserModal.aggregate([
            {
                $match: {
                    active: true,
                    _id: { $ne: idUser }
                }
            },
            {
                $lookup: {
                    from: 'rooms',
                    let: { userId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        { $and: [{ $eq: ['$userIdSender', idUser] }, { $eq: ['$userIdReceiver', '$$userId'] }] },
                                        { $and: [{ $eq: ['$userIdReceiver', idUser] }, { $eq: ['$userIdSender', '$$userId'] }] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'room'
                }

            },
            {
                $sort: {
                    'room.status': 1
                }
            },



        ]);

        res.status(200).json(User);

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error retrieving friends" });
    }
}





exports.token = async (req, res) => {
    const user = { id: 1, username: 'john_doe', role: 'admin' };
    const payload = {
        userId: user.id,
        username: user.username,
        role: user.role // ตัวอย่าง payload ที่จะเก็บใน Token
    };

    const secretKey = 'tanet_limsumangkolkun'; // คีย์ลับสำหรับการเข้ารหัส Token
    const options = {
        expiresIn: '24h' // ตั้งเวลาหมดอายุของ Token
    };

    // สร้าง Token ด้วย jwt.sign
    const token = jwt.sign(payload, secretKey, options);
    res.status(200).send(token);
}