const fs = require('fs');
const path = require('path');

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function readDB(file) {
  try {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export default function handler(req, res) {
  setCORS(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    try {
      const users = readDB(path.join(process.cwd(), 'data', 'users.json'));
      const centers = readDB(path.join(process.cwd(), 'data', 'recycling-centers.json'));
      const feedback = readDB(path.join(process.cwd(), 'data', 'feedback.json'));

      const totalUsers = users.length;
      const totalCenters = centers.length;
      const totalFeedback = feedback.length;
      const totalRecycled = users.reduce((sum, u) => {
        if (u.recyclingHistory) {
          return sum + u.recyclingHistory.reduce((s, h) => s + (h.quantity || 0), 0);
        }
        return sum;
      }, 0);
      const totalPointsAwarded = users.reduce((sum, u) => sum + (u.rewardPoints || 0), 0);

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
}
