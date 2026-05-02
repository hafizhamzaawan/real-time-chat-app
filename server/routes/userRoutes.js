const express = require('express');
const router = express.Router();
const { register, login, checkAuth, updateProfile, getAllUsers } = require('../controllers/userController');
const protectRoute = require('../middleware/auth');

router.post('/register', register)
router.post('/login', login)
router.get('/check', protectRoute, checkAuth)
router.put('/update-profile', protectRoute, updateProfile)
router.get('/all-users', protectRoute, getAllUsers)

module.exports = router;