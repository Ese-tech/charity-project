// server/src/routes/userRoutes.ts

import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword, // <-- ADD THIS IMPORT
  resetPassword, // <-- ADD THIS IMPORT
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes for user authentication and password management
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword); // <-- ADDED: Route to request a password reset
router.post('/reset-password/:token', resetPassword); // <-- ADDED: Route to reset the password

// Private routes that require authentication
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;