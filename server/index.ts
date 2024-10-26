import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import connectDB from './utils/database';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB()
  .then((result) => {
    console.log('Database initialization result:', result);
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
  });

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  }
}));

app.use(express.static(path.join(__dirname, '/')));

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

app.get('/api/dashboard/stats', (_req, res) => {
  return res.json({
    totalIncidents: 42,
    totalWarnings: 15,
    totalBans: 7,
    totalVenues: 3,
  });
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