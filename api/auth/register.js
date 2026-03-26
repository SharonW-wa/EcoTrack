const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
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

function writeDB(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { fullName, email, phone, password } = req.body;
      const users = readDB(path.join(process.cwd(), 'data', 'users.json'));

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
      writeDB(path.join(process.cwd(), 'data', 'users.json'), users);

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
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}