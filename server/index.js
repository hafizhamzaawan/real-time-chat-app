import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { initSocket } from './socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
    await connectDB();
    await connectCloudinary();
    console.log(`Server running on port ${PORT}`)
})