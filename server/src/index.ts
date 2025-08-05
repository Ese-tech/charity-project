import express,{Application, Request, Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {connectDB} from './config/db.js';

dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route for testing
app.get('/', (req: Request, res: Response) => {
    res.send('Weaving Futures API is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
