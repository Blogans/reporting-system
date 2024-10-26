// index.ts
import express from 'express';
import cors from 'cors';
import dashboardRoutes from './routes/dashboard.route';

const app = express();
const port = 8080;

app.use(cors({
  origin: '*',
}));

app.use('/api/dashboard', dashboardRoutes);

app.get('/api/ping', (_req, res) => {
  res.json({ message: 'pong' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});