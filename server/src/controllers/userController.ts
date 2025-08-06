import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

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