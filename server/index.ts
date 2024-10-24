import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import session from 'express-session';
import path from 'path';
import { connectToDatabase } from './utils/database';
import venueRoutes from './routes/venue.route';
import dashboardRoutes from './routes/dashboard.route';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  exposedHeaders: ['set-cookie']
}));


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

// Routes
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

async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`CORS enabled for origin: http://localhost:5173`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

startServer();

export default app;