const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const connectCloudinary = require('./config/cloudinary');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

// Online users map
const userSocketMap = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id;

    // Send online users to all clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    })
})

// CommonJS export
const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

module.exports = { io, getReceiverSocketId };

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);

// Connect DB + Cloudinary + Start Server
const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
    await connectDB();
    await connectCloudinary();
    console.log(`Server running on port ${PORT}`)
})