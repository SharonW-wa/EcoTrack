import mysql from 'mysql2/promise';

const conn = await mysql.createConnection({
  host: 'shortline.proxy.rlwy.net',
  port: 33999,
  user: 'root',
  password: 'dNVQXrFnjrATBQNJhzyfoRlYNRtgQtfB',
  database: 'railway',
  ssl: { rejectUnauthorized: false }
});

await conn.execute('DROP TABLE IF EXISTS users');

await conn.execute('CREATE TABLE users (id VARCHAR(50) PRIMARY KEY, fullName VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, phone VARCHAR(50) DEFAULT \'\', password VARCHAR(255) NOT NULL, rewardPoints INT DEFAULT 0, isVerified TINYINT(1) DEFAULT 0, verificationToken VARCHAR(255), tokenExpiry DATETIME, role VARCHAR(50) DEFAULT \'user\', createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)');

console.log('Users table recreated!');
await conn.end();