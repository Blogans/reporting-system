import express from 'express';
import * as dotenv from 'dotenv';
import session from 'express-session';
import path from 'path';
import { connectToDatabase } from './utils/database';
import venueRoutes from './routes/venue.route';
import dashboardRoutes from './routes/dashboard.route';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

// Middlewares
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// API Routes
app.use('/api/venues', venueRoutes);
app.use('/api/dashboard', dashboardRoutes);


// Basic test route
app.get('/api/test', (_req, res) => {
  res.json({ message: 'API is working!' });
});

// Production static file serving
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client')));
  
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
  });
}

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client')));

// All other GET requests not handled before will return our React app
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

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