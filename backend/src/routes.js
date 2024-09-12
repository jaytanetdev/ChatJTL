
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./middleware/auth'); // นำเข้าฟังก์ชัน authenticateToken จากไฟล์ auth.js
const MasssageController = require('./controller/massage-controller');
const UserController = require('./controller/user-controller');
const RoomController = require('./controller/room-controller');

//สร้างโทเคน
router.post('/token', UserController.token);


//แชท
router.post('/ins/ChatMassage', authenticateToken, MasssageController.insChatMassage);
router.get('/get/ChatMassage/:roomId', authenticateToken, MasssageController.getChatMassage);
router.put('/update/ChatMessage/:roomId/:userId/:sendByUserId', authenticateToken, MasssageController.updateChatMessage);


//ผู้ใช้
router.post('/ins/user', authenticateToken, UserController.insUser);
router.get('/get/user/checkregister', authenticateToken, UserController.getCheckRegister);
router.get('/get/user', authenticateToken, UserController.getUser);
router.get('/get/Friend/:idUser', authenticateToken, UserController.getUserFriend);

//ห้อง
router.post('/ins/room', authenticateToken, RoomController.insRoom);
router.put('/update/room/:roomId', authenticateToken, RoomController.updateRoom);
router.get('/get/room/:idUser', authenticateToken, RoomController.getRoom);
router.get('/get/UserReceiver/:idUser/:roomId', authenticateToken, RoomController.checkUserReceiver);
router.get('/count/waitReceiveFriend/:idUser', authenticateToken, RoomController.waitReceiveFriend);




module.exports = router;

