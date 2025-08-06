import { Request, Response, NextFunction } from 'express'; // Added NextFunction for completeness
import { User } from '../models/User';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // *** CRITICAL CHANGE HERE: Use User.create() for secure password hashing ***
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      // Return relevant user data, but NOT the password
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    if (error instanceof Error) {
      // For database or validation errors, send the specific message
      res.status(500).json({ message: error.message });
    } else {
      // For unknown errors
      res.status(500).json({ message: 'Server error' });
    }
  }
};