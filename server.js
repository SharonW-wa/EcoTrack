require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'waste-management-secret-key-2024';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==================== API ROOT ====================

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to EcoTrack API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      recyclingCenters: '/api/recycling-centers',
      wasteCategories: '/api/waste-categories',
      feedback: '/api/feedback',
      rewards: '/api/rewards',
      ecoQuotes: '/api/eco-quotes',
      health: '/api/health'
    }
  });
});

// Data directory
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Database files
const DB_FILES = {
  users: path.join(DATA_DIR, 'users.json'),
  recyclingCenters: path.join(DATA_DIR, 'recycling-centers.json'),
  feedback: path.join(DATA_DIR, 'feedback.json'),
  rewards: path.join(DATA_DIR, 'rewards.json'),
  ecoQuotes: path.join(DATA_DIR, 'eco-quotes.json'),
  wasteCategories: path.join(DATA_DIR, 'waste-categories.json')
};

// Initialize database files with default data
function initializeDatabase() {
  // Users
  if (!fs.existsSync(DB_FILES.users)) {
    fs.writeFileSync(DB_FILES.users, JSON.stringify([], null, 2));
  }

  // Recycling Centers (Kenya-based)
  if (!fs.existsSync(DB_FILES.recyclingCenters)) {
    const defaultCenters = [
      {
        id: 'rc1',
        name: 'Nairobi Recycling Center',
        address: 'Industrial Area, Nairobi',
        latitude: -1.2921,
        longitude: 36.8219,
        phone: '+254 712 345 678',
        email: 'nairobi@recycle.co.ke',
        acceptedWaste: ['plastic', 'paper', 'metal', 'glass'],
        operatingHours: 'Mon-Sat: 8AM - 5PM'
      },
      {
        id: 'rc2',
        name: 'Mombasa Eco-Recycle',
        address: 'Mikindani, Mombasa',
        latitude: -4.0435,
        longitude: 39.6682,
        phone: '+254 723 456 789',
        email: 'mombasa@recycle.co.ke',
        acceptedWaste: ['plastic', 'glass', 'organic'],
        operatingHours: 'Mon-Fri: 7AM - 6PM'
      },
      {
        id: 'rc3',
        name: 'Kisumu Green Waste',
        address: 'Kisumu Industrial Estate',
        latitude: -0.1022,
        longitude: 34.7617,
        phone: '+254 734 567 890',
        email: 'kisumu@recycle.co.ke',
        acceptedWaste: ['paper', 'metal', 'plastic'],
        operatingHours: 'Mon-Sat: 8AM - 4PM'
      },
      {
        id: 'rc4',
        name: 'Nakuru Recycling Hub',
        address: 'Nakuru Town, Near Lake Nakuru',
        latitude: -0.3031,
        longitude: 36.0800,
        phone: '+254 745 678 901',
        email: 'nakuru@recycle.co.ke',
        acceptedWaste: ['plastic', 'paper', 'glass', 'metal', 'organic'],
        operatingHours: 'Mon-Sun: 7AM - 7PM'
      },
      {
        id: 'rc5',
        name: 'Eldoret Waste Solutions',
        address: 'Eldoret Industrial Area',
        latitude: 0.5143,
        longitude: 35.2698,
        phone: '+254 756 789 012',
        email: 'eldoret@recycle.co.ke',
        acceptedWaste: ['plastic', 'paper', 'metal'],
        operatingHours: 'Mon-Sat: 8AM - 5PM'
      }
    ];
    fs.writeFileSync(DB_FILES.recyclingCenters, JSON.stringify(defaultCenters, null, 2));
  }

  // Feedback
  if (!fs.existsSync(DB_FILES.feedback)) {
    fs.writeFileSync(DB_FILES.feedback, JSON.stringify([], null, 2));
  }

  // Rewards
  if (!fs.existsSync(DB_FILES.rewards)) {
    fs.writeFileSync(DB_FILES.rewards, JSON.stringify([], null, 2));
  }

  // Eco Quotes
  if (!fs.existsSync(DB_FILES.ecoQuotes)) {
    const defaultQuotes = [
      { id: 'q1', quote: "The Earth does not belong to us. We belong to the Earth.", author: "Chief Seattle" },
      { id: 'q2', quote: "There is no Planet B.", author: "Unknown" },
      { id: 'q3', quote: "Reduce, Reuse, Recycle - it's not just a slogan, it's a way of life.", author: "Unknown" },
      { id: 'q4', quote: "Nature is not a place to visit. It is home.", author: "Gary Snyder" },
      { id: 'q5', quote: "We do not inherit the Earth from our ancestors; we borrow it from our children.", author: "Native American Proverb" },
      { id: 'q6', quote: "Every piece of plastic ever made still exists.", author: "Unknown" },
      { id: 'q7', quote: "Be the change you wish to see in the world.", author: "Mahatma Gandhi" },
      { id: 'q8', quote: "A clean environment is a human right like any other.", author: "Dalai Lama" },
      { id: 'q9', quote: "Sustainability is not a trend, it's a responsibility.", author: "Unknown" },
      { id: 'q10', quote: "Small acts, when multiplied by millions of people, can transform the world.", author: "Howard Zinn" }
    ];
    fs.writeFileSync(DB_FILES.ecoQuotes, JSON.stringify(defaultQuotes, null, 2));
  }

  // Waste Categories
  if (!fs.existsSync(DB_FILES.wasteCategories)) {
    const defaultCategories = [
      {
        id: 'wc1',
        name: 'Plastic',
        icon: '♳',
        color: '#FF6B6B',
        description: 'Plastic bottles, containers, bags, and packaging materials',
        examples: ['Water bottles', 'Food containers', 'Shopping bags', 'Plastic cups', 'Packaging foam'],
        disposalInstructions: 'Rinse containers, remove caps, flatten bottles to save space',
        recyclable: true,
        environmentalImpact: 'Takes 450+ years to decompose, harms marine life'
      },
      {
        id: 'wc2',
        name: 'Paper',
        icon: '📄',
        color: '#4ECDC4',
        description: 'Newspapers, magazines, cardboard, and office paper',
        examples: ['Newspapers', 'Cardboard boxes', 'Office paper', 'Magazines', 'Paper bags'],
        disposalInstructions: 'Keep dry, flatten cardboard boxes, remove plastic windows',
        recyclable: true,
        environmentalImpact: 'Recycling 1 ton saves 17 trees and 7,000 gallons of water'
      },
      {
        id: 'wc3',
        name: 'Glass',
        icon: '🍾',
        color: '#95E1D3',
        description: 'Glass bottles, jars, and containers',
        examples: ['Wine bottles', 'Food jars', 'Glass containers', 'Drinking glasses'],
        disposalInstructions: 'Rinse thoroughly, remove lids and caps, sort by color if required',
        recyclable: true,
        environmentalImpact: 'Infinitely recyclable without quality loss'
      },
      {
        id: 'wc4',
        name: 'Metal',
        icon: '🔧',
        color: '#F7DC6F',
        description: 'Aluminum cans, steel containers, and scrap metal',
        examples: ['Soda cans', 'Food cans', 'Aluminum foil', 'Metal lids', 'Scrap metal'],
        disposalInstructions: 'Rinse cans, remove labels if possible, crush to save space',
        recyclable: true,
        environmentalImpact: 'Recycling aluminum saves 95% of energy vs. new production'
      },
      {
        id: 'wc5',
        name: 'Organic',
        icon: '🍃',
        color: '#82E0AA',
        description: 'Food waste, yard waste, and compostable materials',
        examples: ['Fruit peels', 'Vegetable scraps', 'Coffee grounds', 'Eggshells', 'Yard trimmings'],
        disposalInstructions: 'Compost when possible, separate from other waste',
        recyclable: true,
        environmentalImpact: 'Composting reduces methane emissions from landfills'
      }
    ];
    fs.writeFileSync(DB_FILES.wasteCategories, JSON.stringify(defaultCategories, null, 2));
  }
}

// Helper functions
function readDB(file) {
  try {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeDB(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ==================== AUTH MIDDLEWARE ====================

// User authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const users = readDB(DB_FILES.users);
    const user = users.find(u => u.id === decoded.userId);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

// Initialize database
initializeDatabase();

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    const users = readDB(DB_FILES.users);

    // Check if user exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      id: uuidv4(),
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: 'user',
      rewardPoints: 0,
      createdAt: new Date().toISOString(),
      recyclingHistory: []
    };

    users.push(newUser);
    writeDB(DB_FILES.users, users);

    // Generate token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        rewardPoints: newUser.rewardPoints
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = readDB(DB_FILES.users);

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        rewardPoints: user.rewardPoints,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const users = readDB(DB_FILES.users);
    const user = users.find(u => u.id === req.user.userId);
    
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== RECYCLING CENTERS ROUTES ====================

// Get all recycling centers
app.get('/api/recycling-centers', (req, res) => {
  try {
    const centers = readDB(DB_FILES.recyclingCenters);
    res.json(centers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get nearby recycling centers
app.get('/api/recycling-centers/nearby', (req, res) => {
  try {
    const { lat, lng, radius = 50 } = req.query;
    const centers = readDB(DB_FILES.recyclingCenters);
    
    function getDistance(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    }

    const nearbyCenters = centers.map(center => ({
      ...center,
      distance: lat && lng ? getDistance(parseFloat(lat), parseFloat(lng), center.latitude, center.longitude) : null
    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));

    res.json(nearbyCenters);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== ADMIN ROUTES ====================

// Add a new recycling center
app.post('/api/admin/centers', authenticateAdmin, (req, res) => {
  try {
    const centers = readDB(DB_FILES.recyclingCenters);
    const newCenter = { id: uuidv4(), ...req.body };
    centers.push(newCenter);
    writeDB(DB_FILES.recyclingCenters, centers);
    res.status(201).json(newCenter);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a recycling center
app.put('/api/admin/centers/:id', authenticateAdmin, (req, res) => {
  try {
    const centers = readDB(DB_FILES.recyclingCenters);
    const index = centers.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Center not found' });

    centers[index] = { ...centers[index], ...req.body };
    writeDB(DB_FILES.recyclingCenters, centers);
    res.json(centers[index]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a recycling center
app.delete('/api/admin/centers/:id', authenticateAdmin, (req, res) => {
  try {
    let centers = readDB(DB_FILES.recyclingCenters);
    centers = centers.filter(c => c.id !== req.params.id);
    writeDB(DB_FILES.recyclingCenters, centers);
    res.json({ message: 'Center deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== WASTE CATEGORIES ROUTES ====================

// Get all waste categories
app.get('/api/waste-categories', (req, res) => {
  try {
    const categories = readDB(DB_FILES.wasteCategories);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== ECO QUOTES ROUTES ====================

// Get all eco quotes
app.get('/api/eco-quotes', (req, res) => {
  try {
    const quotes = readDB(DB_FILES.ecoQuotes);
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get random eco quote
app.get('/api/eco-quotes/random', (req, res) => {
  try {
    const quotes = readDB(DB_FILES.ecoQuotes);
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json(randomQuote);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== FEEDBACK ROUTES ====================

// Submit feedback
app.post('/api/feedback', authenticateToken, (req, res) => {
  try {
    const { type, message, rating } = req.body;
    const feedback = readDB(DB_FILES.feedback);
    const users = readDB(DB_FILES.users);
    
    const user = users.find(u => u.id === req.user.userId);

    const newFeedback = {
      id: uuidv4(),
      userId: req.user.userId,
      userName: user ? user.fullName : 'Anonymous',
      type,
      message,
      rating,
      createdAt: new Date().toISOString()
    };

    feedback.push(newFeedback);
    writeDB(DB_FILES.feedback, feedback);

    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all feedback
app.get('/api/feedback', (req, res) => {
  try {
    const feedback = readDB(DB_FILES.feedback);
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== REWARDS ROUTES ====================

// Get user rewards
app.get('/api/rewards', authenticateToken, (req, res) => {
  try {
    const rewards = readDB(DB_FILES.rewards);
    const userRewards = rewards.filter(r => r.userId === req.user.userId);
    res.json(userRewards);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add recycling activity and earn points
app.post('/api/rewards/recycle', authenticateToken, (req, res) => {
  try {
    const { wasteType, quantity, centerId } = req.body;
    const users = readDB(DB_FILES.users);
    const rewards = readDB(DB_FILES.rewards);
    
    const userIndex = users.findIndex(u => u.id === req.user.userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    const pointsEarned = Math.round(quantity * 10);

    users[userIndex].rewardPoints += pointsEarned;
    
    const recyclingActivity = {
      id: uuidv4(),
      wasteType,
      quantity,
      centerId,
      pointsEarned,
      date: new Date().toISOString()
    };
    
    if (!users[userIndex].recyclingHistory) {
      users[userIndex].recyclingHistory = [];
    }
    users[userIndex].recyclingHistory.push(recyclingActivity);
    
    writeDB(DB_FILES.users, users);

    const newReward = {
      id: uuidv4(),
      userId: req.user.userId,
      activityId: recyclingActivity.id,
      points: pointsEarned,
      type: 'earned',
      description: `Recycled ${quantity}kg of ${wasteType}`,
      createdAt: new Date().toISOString()
    };
    
    rewards.push(newReward);
    writeDB(DB_FILES.rewards, rewards);

    res.json({
      message: 'Recycling activity recorded successfully',
      pointsEarned,
      totalPoints: users[userIndex].rewardPoints,
      activity: recyclingActivity
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Redeem points
app.post('/api/rewards/redeem', authenticateToken, (req, res) => {
  try {
    const { points, rewardType } = req.body;
    const users = readDB(DB_FILES.users);
    const rewards = readDB(DB_FILES.rewards);
    
    const userIndex = users.findIndex(u => u.id === req.user.userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (users[userIndex].rewardPoints < points) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    users[userIndex].rewardPoints -= points;
    writeDB(DB_FILES.users, users);

    const redemption = {
      id: uuidv4(),
      userId: req.user.userId,
      points: -points,
      type: 'redeemed',
      rewardType,
      description: `Redeemed ${points} points for ${rewardType}`,
      createdAt: new Date().toISOString()
    };
    
    rewards.push(redemption);
    writeDB(DB_FILES.rewards, rewards);

    res.json({
      message: 'Points redeemed successfully',
      pointsRedeemed: points,
      remainingPoints: users[userIndex].rewardPoints,
      rewardType
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== LEADERBOARD ROUTES ====================

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
  try {
    const users = readDB(DB_FILES.users);
    const leaderboard = users
      .map(u => ({
        id: u.id,
        fullName: u.fullName,
        rewardPoints: u.rewardPoints,
        recyclingCount: u.recyclingHistory ? u.recyclingHistory.length : 0
      }))
      .sort((a, b) => b.rewardPoints - a.rewardPoints)
      .slice(0, 10);
    
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== STATS ROUTES ====================

// Get system statistics
app.get('/api/stats', (req, res) => {
  try {
    const users = readDB(DB_FILES.users);
    const centers = readDB(DB_FILES.recyclingCenters);
    const feedback = readDB(DB_FILES.feedback);
    
    const totalUsers = users.length;
    const totalCenters = centers.length;
    const totalFeedback = feedback.length;
    const totalRecycled = users.reduce((sum, u) => {
      if (u.recyclingHistory) {
        return sum + u.recyclingHistory.reduce((s, h) => s + h.quantity, 0);
      }
      return sum;
    }, 0);
    const totalPointsAwarded = users.reduce((sum, u) => sum + u.rewardPoints, 0);

    res.json({
      totalUsers,
      totalCenters,
      totalFeedback,
      totalRecycled: Math.round(totalRecycled * 100) / 100,
      totalPointsAwarded
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Waste Management System API is running' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=================================`);
  console.log(`Waste Management System Server`);
  console.log(`=================================`);
  console.log(`Server running on port ${PORT}`);
  console.log(`API Base URL (Local): http://localhost:${PORT}/api`);
  console.log(`API Base URL (Network): http://<your-ip>:${PORT}/api`);
  console.log(`(Replace <your-ip> with your machine's local IP, e.g. 192.168.0.102)`);
  console.log(`Data directory: ${DATA_DIR}`);
  console.log(`=================================`);
});

module.exports = app;