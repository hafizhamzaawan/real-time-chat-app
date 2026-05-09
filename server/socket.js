import { Server } from 'socket.io';

let io;
const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        const userId = socket.handshake.query.userId;

        if (userId) {
            const existingSocketId = userSocketMap[userId];
            if (existingSocketId && existingSocketId !== socket.id) {
                const existingSocket = io.sockets.sockets.get(existingSocketId);
                if (existingSocket) existingSocket.disconnect(true);
            }
            userSocketMap[userId] = socket.id;
        }

        io.emit('getOnlineUsers', Object.keys(userSocketMap));

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            if (userSocketMap[userId] === socket.id) {
                delete userSocketMap[userId];
            }
            io.emit('getOnlineUsers', Object.keys(userSocketMap));
        });
    });
}

export { io };