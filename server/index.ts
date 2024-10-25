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

const allowedOrigins = [
  'http://localhost:5173',  // Vite dev server
  'http://localhost:5137',  // Your local port
  'http://localhost:8080',  // Express server
  'https://incident-report-system-g4dtfwhwegdvc7ah.australiaeast-01.azurewebsites.net', // Your Azure domain
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Add OPTIONS handling for preflight requests
app.options('*', cors());

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