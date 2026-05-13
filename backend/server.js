import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'waste-management-secret-key-2024';
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==================== NODEMAILER SETUP ====================

const transporter = nodemailer.createTransport({
    service: 'gmail',
    family: 4, //Force IPv4
    auth: {
        user: process.env.EMAIL_USER || 'ecotrak026@gmail.com',
        pass: process.env.EMAIL_PASS
    }
});

// ==================== ADMIN MIDDLEWARE ====================

const isAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const [rows] = await db.query('SELECT role FROM users WHERE id = ?', [decoded.userId]);
        if (rows.length === 0 || rows[0].role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// ==================== AUTHENTICATION ROUTES ====================

app.get('/api/auth/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const [rows] = await db.query(
            'SELECT id, fullName, email, rewardPoints, role FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Full name, email and password are required' });
        }

        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        const verificationToken = uuidv4();
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        await db.query(
            'INSERT INTO users (id, fullName, email, phone, password, rewardPoints, isVerified, verificationToken, tokenExpiry, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, fullName, email, phone || '', hashedPassword, 0, false, verificationToken, tokenExpiry, 'user']
        );

        const verifyLink = `${BASE_URL}/api/auth/verify-email?token=${verificationToken}`;

        await transporter.sendMail({
            from: '"EcoTrack" <ecotrak026@gmail.com>',
            to: email,
            subject: 'Verify your EcoTrack account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #16a34a, #059669); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0;">🌿 EcoTrack</h1>
                        <p style="color: #d1fae5; margin: 5px 0 0;">Promoting sustainable waste management</p>
                    </div>
                    <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #1f2937;">Welcome, ${fullName}! 👋</h2>
                        <p style="color: #4b5563;">Thank you for joining EcoTrack. Please verify your email address to activate your account.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verifyLink}" 
                               style="background: #16a34a; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                                ✅ Verify My Email
                            </a>
                        </div>
                        <p style="color: #6b7280; font-size: 14px;">This link expires in 24 hours.</p>
                        <p style="color: #6b7280; font-size: 14px;">If you didn't create an account, you can safely ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                        <p style="color: #9ca3af; font-size: 12px; text-align: center;">EcoTrack — Making Kenya cleaner and greener 🇰🇪</p>
                    </div>
                </div>
            `
        });

        res.status(201).json({
            message: 'Account created! Please check your email to verify your account before logging in.'
        });

    } catch (error) {
        console.error("❌ REGISTER ERROR:", error.message);
        res.status(500).json({ message: 'Registration error', detail: error.message });
    }
});

app.get('/api/auth/verify-email', async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).send('Invalid verification link.');
        }

        const [rows] = await db.query(
            'SELECT * FROM users WHERE verificationToken = ?', [token]
        );

        if (rows.length === 0) {
            return res.status(400).send('Invalid or already used verification link.');
        }

        const user = rows[0];

        if (new Date() > new Date(user.tokenExpiry)) {
            return res.status(400).send(`
                <h2>Link Expired</h2>
                <p>Your verification link has expired. Please register again.</p>
            `);
        }

        await db.query(
            'UPDATE users SET isVerified = true, verificationToken = NULL, tokenExpiry = NULL WHERE id = ?',
            [user.id]
        );

        res.redirect(`${FRONTEND_URL}/login?verified=true`);

    } catch (error) {
        console.error("❌ VERIFY ERROR:", error.message);
        res.status(500).send('Verification failed. Please try again.');
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                message: 'Please verify your email before logging in. Check your inbox.'
            });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
        res.json({
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                rewardPoints: user.rewardPoints,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Login error' });
    }
});

// ==================== RECYCLING CENTERS ROUTE ====================

app.get('/api/recycling-centers', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM recycling_centers');

        const centers = rows.map(center => ({
            ...center,
            acceptedWaste: typeof center.acceptedWaste === 'string'
                ? JSON.parse(center.acceptedWaste)
                : center.acceptedWaste || []
        }));

        res.json(centers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching centers' });
    }
});

// ==================== ADMIN ROUTES ====================

app.post('/api/admin/centers', isAdmin, async (req, res) => {
    try {
        const { name, address, latitude, longitude, phone, email, acceptedWaste, operatingHours } = req.body;
        const id = 'rc' + Date.now();

        await db.query(
            'INSERT INTO recycling_centers (id, name, address, latitude, longitude, phone, email, acceptedWaste, operatingHours) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, name, address, latitude, longitude, phone, email, JSON.stringify(acceptedWaste), operatingHours]
        );

        res.status(201).json({ success: true, message: 'Center added successfully' });
    } catch (error) {
        console.error("❌ ADMIN ADD CENTER ERROR:", error.message);
        res.status(500).json({ message: 'Error adding center', detail: error.message });
    }
});

app.put('/api/admin/centers/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, latitude, longitude, phone, email, acceptedWaste, operatingHours } = req.body;

        await db.query(
            'UPDATE recycling_centers SET name=?, address=?, latitude=?, longitude=?, phone=?, email=?, acceptedWaste=?, operatingHours=? WHERE id=?',
            [name, address, latitude, longitude, phone, email, JSON.stringify(acceptedWaste), operatingHours, id]
        );

        res.json({ success: true, message: 'Center updated successfully' });
    } catch (error) {
        console.error("❌ ADMIN UPDATE CENTER ERROR:", error.message);
        res.status(500).json({ message: 'Error updating center', detail: error.message });
    }
});

app.delete('/api/admin/centers/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM recycling_centers WHERE id = ?', [id]);
        res.json({ success: true, message: 'Center deleted successfully' });
    } catch (error) {
        console.error("❌ ADMIN DELETE CENTER ERROR:", error.message);
        res.status(500).json({ message: 'Error deleting center', detail: error.message });
    }
});

// ==================== RECYCLING & REWARDS ROUTES ====================

app.post('/api/rewards/recycle', async (req, res) => {
    try {
        const { userId, wasteType, quantity, centerId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required. Please log in again.' });
        }

        const points = Math.round(parseFloat(quantity) * 10);
        const activityId = uuidv4();
        const now = new Date().toISOString();

        await db.query(
            'INSERT INTO activities (id, userId, wasteType, quantity, centerId, pointsEarned, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [activityId, userId, wasteType, quantity, centerId, points, now]
        );

        await db.query('UPDATE users SET rewardPoints = rewardPoints + ? WHERE id = ?', [points, userId]);

        await db.query(
            'INSERT INTO rewards (id, userId, activityId, points, type, description, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [uuidv4(), userId, activityId, points, 'earned', `Recycled ${quantity}kg of ${wasteType}`, now]
        );

        res.json({ success: true, pointsEarned: points });
    } catch (error) {
        console.error("❌ RECYCLE ERROR:", error.message);
        res.status(500).json({ message: 'Error recording activity', detail: error.message });
    }
});

// ==================== REWARDS DATA ROUTE ====================

app.get('/api/rewards', async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ message: 'userId query param required' });
        }

        const [userRows] = await db.query(
            'SELECT fullName, rewardPoints FROM users WHERE id = ?',
            [userId]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const [rewardRows] = await db.query(
            'SELECT * FROM rewards WHERE userId = ? ORDER BY createdAt DESC',
            [userId]
        );

        const user = userRows[0];
        const points = user.rewardPoints || 0;

        res.json({
            points,
            level: points < 100 ? 'Eco Newbie' : points < 500 ? 'Eco Warrior' : 'Eco Champion',
            nextLevelPoints: points < 100 ? 100 : points < 500 ? 500 : 1000,
            rewards: rewardRows
        });

    } catch (error) {
        console.error("❌ REWARDS ERROR:", error.message);
        res.status(500).json({ message: 'Error fetching rewards', detail: error.message });
    }
});

// ==================== FEEDBACK ROUTES ====================

app.get('/api/feedback', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM feedback ORDER BY createdAt DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback' });
    }
});

app.post('/api/feedback', async (req, res) => {
    try {
        const { type, message, rating } = req.body;
        const authHeader = req.headers.authorization;

        let userId = null;
        let userName = 'Anonymous';

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            userId = decoded.userId;

            const [userRows] = await db.query(
                'SELECT fullName FROM users WHERE id = ?', [userId]
            );
            if (userRows.length > 0) {
                userName = userRows[0].fullName;
            }
        }

        const feedbackId = uuidv4();
        const now = new Date().toISOString();

        await db.query(
            'INSERT INTO feedback (id, userId, userName, type, message, rating, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [feedbackId, userId, userName, type, message, rating, now]
        );

        res.status(201).json({ success: true, message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error("❌ FEEDBACK ERROR:", error.message);
        res.status(500).json({ message: 'Error submitting feedback', detail: error.message });
    }
});

// ==================== STATS ROUTE ====================

app.get('/api/stats', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        console.log('Stats userId:', userId);

        const [users] = await db.query('SELECT COUNT(*) as count FROM users');
        const [activities] = await db.query(
            'SELECT COUNT(*) as count FROM activities WHERE userId = ?', [userId]
        );
        const [quantity] = await db.query(
            'SELECT SUM(quantity) as total FROM activities WHERE userId = ?', [userId]
        );

        res.json({
            totalUsers: users[0].count,
            totalActivities: activities[0].count,
            totalWasteRecycled: quantity[0].total || 0
        });
    } catch (error) {
        console.error('Stats error:', error.message);
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

// ==================== WASTE CATEGORIES ROUTE ====================

app.get('/api/waste-categories', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM waste_categories');
        const categories = rows.map(cat => ({
            ...cat,
            examples: typeof cat.examples === 'string'
                ? JSON.parse(cat.examples)
                : cat.examples || [],
            recyclable: cat.recyclable === 1 || cat.recyclable === true
        }));
        res.json(categories);
    } catch (error) {
        console.error("❌ WASTE CATEGORIES ERROR:", error.message);
        res.status(500).json({ message: 'Error fetching categories' });
    }
});

// ==================== DASHBOARD & LEADERBOARD ROUTES ====================

app.get('/api/eco-quotes/random', (req, res) => {
    res.json({
        quote: "The greatest threat to our planet is the belief that someone else will save it.",
        author: "Robert Swan"
    });
});

app.get('/api/leaderboard', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT fullName, rewardPoints FROM users ORDER BY rewardPoints DESC LIMIT 5');
        res.json(rows);
    } catch (error) {
        res.json([]);
    }
});

// ==================== ADMIN STATS ====================
app.get('/api/admin/stats', isAdmin, async (req, res) => {
  try {
    const [users] = await db.query('SELECT COUNT(*) as count FROM users');
    const [activities] = await db.query('SELECT COUNT(*) as count FROM activities');
    const [quantity] = await db.query('SELECT SUM(quantity) as total FROM activities');
    const [centers] = await db.query('SELECT COUNT(*) as count FROM recycling_centers');
    const [feedbackCount] = await db.query('SELECT COUNT(*) as count FROM feedback');
    const [points] = await db.query('SELECT SUM(rewardPoints) as total FROM users');

    res.json({
      totalUsers: users[0].count,
      totalActivities: activities[0].count,
      totalWasteRecycled: quantity[0].total || 0,
      totalCenters: centers[0].count,
      totalFeedback: feedbackCount[0].count,
      totalPoints: points[0].total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin stats' });
  }
});

// ==================== ADMIN USERS ====================
app.get('/api/admin/users', isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, fullName, email, rewardPoints, role, isVerified FROM users ORDER BY rewardPoints DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// ==================== ADMIN ACTIVITIES ====================
app.get('/api/admin/activities', isAdmin, async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 100;
    const [rows] = await db.query(
      `SELECT a.*, u.fullName FROM activities a
       LEFT JOIN users u ON a.userId = u.id
       ORDER BY a.date DESC LIMIT ?`,
      [limit]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities' });
  }
});
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT DATABASE() as db, COUNT(*) as centers FROM recycling_centers");
    res.json({ 
      connected_to: rows[0].db,
      center_count: rows[0].centers 
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});
// ==================== SERVER START ====================
app.listen(PORT, '0.0.0.0', () => {
    console.log("🔗 EcoTrack is now connected to MySQL!");
    console.log("=========================================");
    console.log("🌿 EcoTrack Server Status: ONLINE");
    console.log(`🔌 Port: ${PORT}`);
    console.log(`🌐 Endpoint: http://192.168.0.101:${PORT}`);
    console.log("=========================================");
});