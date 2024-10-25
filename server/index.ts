import express from 'express';
import cors from 'cors';
import path from 'path';
import venueRoutes from './routes/venue.route';

const app = express();
const PORT = process.env.PORT || 8080;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  'https://incident-report-system-g4dtfwhwegdvc7ah.australiaeast-01.azurewebsites.net',
  '*'
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use('/api/venues', venueRoutes);

app.get('/api/test', (_req, res) => {
  res.json({ message: 'Hello from server!' });
});

// Serve static files from root
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../')));
  
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;