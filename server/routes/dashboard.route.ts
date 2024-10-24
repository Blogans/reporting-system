import express from 'express';
const router = express.Router();

router.get('/stats', (_req, res) => {
  try {
    res.json({
      totalIncidents: 42,
      totalWarnings: 15,
      totalBans: 7,
      totalVenues: 3
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;