import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import path from 'path';
import session from 'express-session';
import { connectToDatabase } from './utils/database';
import venueRoutes from './routes/venue.route';
import dashboardRoutes from './routes/dashboard.route';
import authRoutes from './routes/auth.route';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Only use CORS in development
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:8080'],
    credentials: true
  }));
}

app.use(express.json());

// Session configuration with proper cookie settings
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

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the dist directory
  app.use(express.static(path.join(__dirname, '../')));
  
  // Handle client-side routing
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
  });
}

async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;