// index.ts
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({
  origin: '*',
}));

app.get('/api/ping', (_req, res) => {
  res.json({ message: 'pong' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});