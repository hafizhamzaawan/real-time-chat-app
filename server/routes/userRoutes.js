import express from 'express';
import { register, login, checkAuth, updateProfile, getAllUsers } from '../controllers/userController.js';
import protectRoute from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.get('/check', protectRoute, checkAuth)
router.put('/update-profile', protectRoute, updateProfile)
router.get('/all-users', protectRoute, getAllUsers)

export default router;