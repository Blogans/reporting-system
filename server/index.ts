import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Debug middleware
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());

// Test API endpoint
app.get('/api/test', (_req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'API is working!' });
});

// Serve static files from root
app.use(express.static(path.join(__dirname, '..')));

// Catch-all route
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;