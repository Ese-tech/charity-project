import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User, IUser } from '../models/User';

// Extending the Request type to include the user property
export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // We are directly asserting that JWT_SECRET is a string.
      // With your strict tsconfig, this is the most reliable way to handle it.
      const jwtSecret = process.env.JWT_SECRET;
      
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined in environment variables.');
      }
      
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      if (!decoded.id || typeof decoded.id !== 'string') {
        throw new Error('Invalid token payload.');
      }

      req.user = await User.findById(decoded.id).select('-password') as IUser;

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};