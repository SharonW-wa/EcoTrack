import mysql from 'mysql2/promise';

// This matches your Navicat setup
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'ecotrack',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('🔗 EcoTrack is now connected to MySQL!');

export default pool;