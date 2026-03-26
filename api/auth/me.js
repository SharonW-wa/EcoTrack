const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET || 'waste-management-secret-key-2024';

function readDB(file) {
  try {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function authenticateToken(req) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new Error('Access token required');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const decoded = authenticateToken(req);
      const users = readDB(path.join(process.cwd(), 'data', 'users.json'));
      const user = users.find(u => u.id === decoded.userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        rewardPoints: user.rewardPoints,
        role: user.role,
        recyclingHistory: user.recyclingHistory
      });
    } catch (error) {
      if (error.message === 'Access token required' || error.message === 'Invalid token') {
        res.status(403).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Server error', error: error.message });
      }
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}