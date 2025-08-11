// server/src/controllers/userController.ts

import { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // <-- ADD THIS IMPORT

// @desc    Request a password reset token
// @route   POST /api/users/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: 'User with this email not found' });
      return;
    }
    
    // Generate reset token and set expiration
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // In a real application, you would send an email here.
    // For this demo, we'll just log the token and the reset URL.
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
    console.log(`Password reset requested for ${user.email}. Reset URL: ${resetUrl}`);
    
    res.status(200).json({
      message: 'Password reset link sent to your email (for now, check the console)',
      resetUrl,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// @desc    Reset password with a token
// @route   POST /api/users/reset-password/:token
// @access  Public
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    res.status(400).json({ message: 'New password is required' });
    return;
  }
  
  try {
    // Hash the token from the request to find the user
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: resetTokenHash,
      passwordResetExpires: { $gt: new Date(Date.now()) },
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }

    // Update the password, remove the token fields
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save(); // The pre-save middleware will hash the new password

    res.status(200).json({ message: 'Password reset successful. You can now log in with your new password.' });

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};


// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: user.generateAuthToken(), // Generate token on registration
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: user.generateAuthToken(),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = req.user; // req.user is populated by the protect middleware

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = req.user; // req.user is populated by the protect middleware

  if (user) {
    const { name, email, password } = req.body;

    user.name = name || user.name;
    user.email = email || user.email;

    // Only update password if a new one is provided
    if (password) {
      user.password = password; // The pre('save') middleware will hash this
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: updatedUser.generateAuthToken(), // Generate a new token if profile is updated
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};