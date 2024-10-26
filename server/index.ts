import express from 'express';
import path from 'path';
import venueRoutes from './routes/venue.route';

const app = express();
const PORT = process.env.PORT || 8080;

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