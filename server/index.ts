import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import authRoutes from './routes/auth.route.js';
import venueRoutes from './routes/venue.route.js';
import contactRoutes from './routes/contact.route.js';
import offenderRoutes from './routes/offender.route.js';
import userRoutes from './routes/user.route.js';
import incidentRoutes from './routes/incident.route.js';
import warningsRoutes from './routes/warning.route.js';
import bansRoutes from './routes/ban.route.js';
import dashboardRoutes from './routes/dashboard.route.js';
import reportRoutes from './routes/report.route.js';
import { fileURLToPath } from 'url';
import path from 'path';
import databaseSeeder from './utils/databaseSeeder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// CORS configuration
if (process.env.NODE_ENV === 'production') {
  app.use(cors());
} else {
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
}

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hour session expiry
  }
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/offenders', offenderRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/warnings', warningsRoutes);
app.use('/api/bans', bansRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

// Catch-all route for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

async function connectToDatabase() {
  try {
    console.log('Connecting to database');
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

async function startServer() {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Check if this file is being run directly
if (path.resolve(__filename) === path.resolve(process.argv[1])) {
  startServer();
  await databaseSeeder();
}

export { app, startServer, connectToDatabase };