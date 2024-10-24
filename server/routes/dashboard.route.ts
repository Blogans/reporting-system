// routes/dashboard.route.ts
import express from 'express';
const router = express.Router();

router.get('/stats', (req, res) => {
  console.log('Received request for /api/dashboard/stats');
  console.log('Headers:', req.headers);
  
  try {
    const stats = {
      totalIncidents: 42,
      totalWarnings: 15,
      totalBans: 7,
      totalVenues: 3
    };
    
    res.setHeader('Content-Type', 'application/json');
    console.log('Sending response:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Error in dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;