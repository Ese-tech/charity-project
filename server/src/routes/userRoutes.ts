import express from 'express';
import { registerUser, loginUser } from '../controllers/userController'; // Import loginUser

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser); // Add the new login route

export default router;