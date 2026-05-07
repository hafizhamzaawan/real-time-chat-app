import Message from '../models/Message.js';
import User from '../models/User.js';
import { v2 as cloudinary } from 'cloudinary';
import { getReceiverSocketId, io } from '../socket.js';

const getMessages = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user.userId;

        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        })

        await Message.updateMany(
            { senderId: receiverId, receiverId: senderId, seen: false },
            { seen: true }
        )

        res.json({ success: true, messages })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const sendMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user.userId;
        const { text, image } = req.body;

        let imageUrl = "";
        if(image){
            const upload = await cloudinary.uploader.upload(image);
            imageUrl = upload.secure_url;
        }

        const newMessage = await Message.create({ senderId, receiverId, text, image: imageUrl })

        // Emit to receiver via socket
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.json({ success: true, newMessage })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user.userId;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select('-password');

        const unseenMessages = {};
        const promises = filteredUsers.map(async (user) => {
            const count = await Message.countDocuments({
                senderId: user._id,
                receiverId: userId,
                seen: false
            })
            if(count > 0) unseenMessages[user._id] = count;
        })
        await Promise.all(promises);

        res.json({ success: true, users: filteredUsers, unseenMessages })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export { getMessages, sendMessage, getUsersForSidebar }