const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Register User
const register = async (req, res) => {
    try {
        const { fullName, email, password, bio } = req.body;

        if(!fullName || !email || !password || !bio){
            return res.json({ success: false, message: "All fields are required" })
        }

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.json({ success: false, message: "Account already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio
        })

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ success: true, userData: newUser, token, message: "Account created successfully" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Login User
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.json({ success: false, message: "All fields are required" })
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.json({ success: false, message: "Account not found" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ success: true, userData: user, token, message: "Login successful" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Check Auth
const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json({ success: true, userData: user })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Update Profile
const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;
        const userId = req.user.userId;

        let updatedData = { bio, fullName };

        if(profilePic){
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedData.profilePic = upload.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select('-password');

        res.json({ success: true, user: updatedUser })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const userId = req.user.userId;
        const users = await User.find({ _id: { $ne: userId } }).select('-password');
        res.json({ success: true, users })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

module.exports = { register, login, checkAuth, updateProfile, getAllUsers }