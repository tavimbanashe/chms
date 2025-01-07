// db.js
const { Pool } = require('pg');
require('dotenv').config();

// Initialize connection pool
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

pool.on('connect', () => {
    console.log('Connected to the database.');
});

pool.on('error', (err) => {
    console.error('Database error:', err.message);
    process.exit(-1); // Exit process on critical database errors
});

// Export pool for use in other files
module.exports = pool;
