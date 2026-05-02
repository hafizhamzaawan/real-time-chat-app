const Message = require('../models/Message');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

// Get All Messages between 2 users
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

        // Mark messages as seen
        await Message.updateMany(
            { senderId: receiverId, receiverId: senderId, seen: false },
            { seen: true }
        )

        res.json({ success: true, messages })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Send Message
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

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        res.json({ success: true, newMessage })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Get Users for Sidebar (with unseen message count)
const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user.userId;

        const filteredUsers = await User.find({ _id: { $ne: userId } }).select('-password');

        // Count unseen messages for each user
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
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

module.exports = { getMessages, sendMessage, getUsersForSidebar }