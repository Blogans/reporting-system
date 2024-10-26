import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import connectDB from './utils/database';
import databaseRoutes from './routes/database.route';
import authRoutes from './routes/auth.route';
import venueRoutes from './routes/venue.route';
import contactRoutes from './routes/contact.route';
import offenderRoutes from './routes/offender.route';
import userRoutes from './routes/user.route';
import incidentRoutes from './routes/incident.route';
import warningsRoutes from './routes/warning.route';
import bansRoutes from './routes/ban.route';
import reportRoutes from './routes/report.route';

dotenv.config();

export const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1)

// Database initialization
export const initializeApp = async () => {
  try {
    const dbResult = await connectDB();
    console.log('Database initialization result:', dbResult);
    return dbResult;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours,
    sameSite: 'none',
    domain: process.env.NODE_ENV === 'production' ? 'incident-report-ebfsc5hthwd9g4a2.canadacentral-01.azurewebsites.net' : 'localhost'  }
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
app.use('/api/auth', authRoutes);
app.use('/api/database', databaseRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/offenders', offenderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/warnings', warningsRoutes);
app.use('/api/bans', bansRoutes);
app.use('/api/reports', reportRoutes);

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
if (process.env.NODE_ENV !== 'test') {
  initializeApp().then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}


export default app;