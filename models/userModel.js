// backend/models/userModel.js
const pool = require('../config/db'); // Directly import pool, as it's exported directly

// Create a new user
const createUser = async ({ username, email, passwordHash, roleId }) => {
    const query = `
        INSERT INTO Users (username, email, password_hash, role_id)
        VALUES ($1, $2, $3, $4) RETURNING user_id;
    `;
    const values = [username, email, passwordHash, roleId];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Find user by email
const findUserByEmail = async (email) => {
    try {
        const query = 'SELECT * FROM Users WHERE email = $1';
        const result = await pool.query(query, [email]);  // This should work now
        return result.rows[0];  // Return the first matching user
    } catch (error) {
        console.error('Error finding user by email:', error.message);
        throw error;  // Propagate the error to be handled by the controller
    }
};

module.exports = { createUser, findUserByEmail };
