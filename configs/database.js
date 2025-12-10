// configs/database.js
const mysql = require('mysql2/promise');

const connectDB = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',   // nếu không có password
    database: process.env.DB_NAME || 'TastManager'
  });
};

module.exports = { connectDB };
