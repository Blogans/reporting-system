import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../dist')));

// Middleware
const allowedOrigins = [
  'http://localhost:5173',  // Local dev
  'http://localhost:3000',  // Local prod build
  'https://incident-report.azurewebsites.net'  // Your Azure domain
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(null, true);  // Just allow all in production for now
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (_req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get('/api/ping', (_req: Request, res: Response) => {
  return res.json({ message: 'pong' });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Start server
const startServer = () => {
  try {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();

export default app;