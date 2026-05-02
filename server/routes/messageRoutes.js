const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, getUsersForSidebar } = require('../controllers/messageController');
const protectRoute = require('../middleware/auth');

router.get('/users', protectRoute, getUsersForSidebar)
router.get('/:id', protectRoute, getMessages)
router.post('/send/:id', protectRoute, sendMessage)

module.exports = router;