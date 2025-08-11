// server/src/index.ts

import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';
import userRoutes from './routes/userRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import charityRoutes from './routes/charityRoutes';

dotenv.config();
connectDB();

const app = express();

// Configure CORS to allow requests from your frontend's origin
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

app.use(cors(corsOptions)); // <-- Use the configured CORS middleware
app.use(express.json());

// Public health check route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

// User routes
app.use('/api/users', userRoutes);

// Charity routes for donations and sponsorships
app.use('/api', charityRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
