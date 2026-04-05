import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import db from './db.js'; // Connection to Navicat

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'waste-management-secret-key-2024';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ==================== EMAIL SETUP ====================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// ==================== AUTH ROUTES ====================

// 1. Register (Save to MySQL)
app.post('/api/auth/register', async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        
        if (existing.length > 0) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = uuidv4();
        const userId = uuidv4();

        await db.query(
            `INSERT INTO users (id, fullName, email, phone, password, role, rewardPoints, isVerified, verificationToken, createdAt) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, fullName, email, phone, hashedPassword, 'user', 0, 0, verificationToken, new Date().toISOString()]
        );

        // Logic to send email would go here (using your existing transporter)
        res.status(201).json({ message: 'Registered! Please verify your email.' });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

// 2. Login (Read from MySQL)
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email first.' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            token,
            user: { id: user.id, fullName: user.fullName, email: user.email, rewardPoints: user.rewardPoints, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Login error', error: error.message });
    }
});

// ==================== APP ROUTES (MySQL Powered) ====================

// Get all Recycling Centers
app.get('/api/recycling-centers', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM recycling_centers');
    res.json(rows);
});

// Get Waste Categories
app.get('/api/waste-categories', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM waste_categories');
    res.json(rows);
});

// Get Random Eco Quote
app.get('/api/eco-quotes/random', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM eco_quotes ORDER BY RAND() LIMIT 1');
    res.json(rows[0]);
});

// Submit Feedback
app.post('/api/feedback', async (req, res) => {
    const { userId, userName, type, message, rating } = req.body;
    await db.query(
        'INSERT INTO feedback (id, userId, userName, type, message, rating, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [uuidv4(), userId, userName, type, message, rating, new Date().toISOString()]
    );
    res.json({ message: 'Feedback sent!' });
});

// ==================== REWARDS & ACTIVITY ====================

app.post('/api/rewards/recycle', async (req, res) => {
    const { userId, wasteType, quantity, centerId } = req.body;
    const points = Math.round(quantity * 10);
    const activityId = uuidv4();

    // Update Points and Log Activity in one go
    await db.query('UPDATE users SET rewardPoints = rewardPoints + ? WHERE id = ?', [points, userId]);
    await db.query(
        'INSERT INTO activities (id, userId, wasteType, quantity, centerId, pointsEarned, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [activityId, userId, wasteType, quantity, centerId, points, new Date().toISOString()]
    );

    res.json({ message: 'Recycling recorded!', pointsEarned: points });
});

app.listen(PORT, () => console.log(`🌍 EcoTrack Server running on port ${PORT}`));