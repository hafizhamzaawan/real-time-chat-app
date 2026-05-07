import express from 'express';
import { getMessages, sendMessage, getUsersForSidebar } from '../controllers/messageController.js';
import protectRoute from '../middleware/auth.js';

const router = express.Router();

router.get('/users', protectRoute, getUsersForSidebar)
router.get('/:id', protectRoute, getMessages)
router.post('/send/:id', protectRoute, sendMessage)

export default router;