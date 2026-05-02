import mysql from 'mysql2/promise';

// This matches your Navicat setup
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {rejectUnauthorized: false}
});

console.log('🔗 EcoTrack is now connected to MySQL!');

export default pool;