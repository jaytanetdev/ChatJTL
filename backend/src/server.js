const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const Message = require('./models/message-modal');
const mongoose = require('mongoose');
const routes = require('./routes');
const MessageModal = require('./models/message-modal');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        // origin: 'https://main--snazzy-malabi-2e2553.netlify.app',
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});

// เชื่อมต่อฐานข้อมูล
connectDB();
app.use(cors());
app.use(express.json());
app.use('/api', routes);
// io.on('connection', (socket) => {
//     // ส่งข้อความที่มีอยู่แล้วในฐานข้อมูลเมื่อมีการเชื่อมต่อใหม่
//     Message.find().then((messages) => {
//         messages.forEach((msg) => {
//             socket.emit('message', msg.content);
//         });
//     });

//     socket.on('message', async (message) => {
//         const newMessage = new Message({ content: message });
//         await newMessage.save(); // บันทึกข้อความลงฐานข้อมูล
//     });


// });

// ตั้งค่า Change Streams
mongoose.connection.once('open', () => {
    const changeStream = Message.watch();
    changeStream.on('change', async (change) => {

        if (change.operationType === 'insert') {
            const data = change.fullDocument;
            io.emit('message_chats', {
                message: data.message,
                sendByUserId: data.sendByUserId,
                roomId: data.roomId,
                read: false,
                _id:data._id
            }); // ส่งข้อความให้ทุกคน
        } else if (change.operationType === 'update') {
            if (change.updateDescription.updatedFields.read === true) {
                const messages = await MessageModal.find({ _id: change.documentKey })
                io.emit('readMessage', {
                    read: true,
                    _id: change.documentKey,
                    roomId: messages[0].roomId
                });
            }
        }
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
