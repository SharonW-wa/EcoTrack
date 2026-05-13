import mysql from 'mysql2/promise';

const conn = await mysql.createConnection({
  host: 'shortline.proxy.rlwy.net',
  port: 33999,
  user: 'root',
  password: 'dNVQXrFnjrATBQNJhzyfoRlYNRtgQtfB',
  database: 'railway',
  ssl: { rejectUnauthorized: false }
});

console.log('✅ Connected!');

await conn.execute(`CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  fullName VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  rewardPoints INT DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

await conn.execute(`CREATE TABLE IF NOT EXISTS recycling_centers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  phone VARCHAR(50),
  email VARCHAR(255),
  acceptedMaterials JSON
)`);

await conn.execute(`CREATE TABLE IF NOT EXISTS activities (
  id VARCHAR(50) PRIMARY KEY,
  userId VARCHAR(50),
  wasteType VARCHAR(100),
  quantity DECIMAL(10,2),
  centerId VARCHAR(50),
  pointsEarned INT,
  date DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

await conn.execute(`CREATE TABLE IF NOT EXISTS rewards (
  id VARCHAR(50) PRIMARY KEY,
  userId VARCHAR(50),
  points INT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

console.log('🎉 All tables created!');
await conn.end();