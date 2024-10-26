import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import databaseRoute from './routes/database.route';
import { connectToDatabase } from './utils/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

// Routes
app.get('/', (_req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use('/api/database', databaseRoute);

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
async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;