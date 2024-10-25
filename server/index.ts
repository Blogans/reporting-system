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

app.use(cors({
  credentials: true
}));

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

// Test API endpoint
app.get('/api/test', (_req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'API is working!' });
});

/*app.get('/api/auth/register', (_req, res) => {
  console.log('Test register hit');
  res.json({ message: 'API is working!' });
});
*/

app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve static files from root
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../')));
  
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
  });
}

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