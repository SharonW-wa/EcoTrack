const db = require('../db');

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async function handler(req, res) {
  setCORS(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    try {
      const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) as totalUsers FROM users');
      const [[{ totalCenters }]] = await db.query('SELECT COUNT(*) as totalCenters FROM recycling_centers');
      const [[{ totalFeedback }]] = await db.query('SELECT COUNT(*) as totalFeedback FROM feedback');
      const [[{ totalRecycled }]] = await db.query('SELECT COALESCE(SUM(quantity), 0) as totalRecycled FROM recycling_history');
      const [[{ totalPointsAwarded }]] = await db.query('SELECT COALESCE(SUM(reward_points), 0) as totalPointsAwarded FROM users');

      res.status(200).json({
        totalUsers,
        totalCenters,
        totalFeedback,
        totalRecycled: Math.round(totalRecycled * 100) / 100,
        totalPointsAwarded
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};