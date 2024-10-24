import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());

// Test API endpoint
app.get('/api/test', (_req, res) => {
  res.json({ message: 'API is working!' });
});

// Add this to your server/index.ts
app.get('/api/dashboard/stats', (_req, res) => {
  // Simulate a delay
  setTimeout(() => {
    res.json({
      totalIncidents: 42,
      totalWarnings: 15,
      totalBans: 7,
      totalVenues: 3,
    });
  }, 1000);
});

// Production static file serving
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