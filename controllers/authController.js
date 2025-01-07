const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');

// Helper function: Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { userId: user.user_id, role: user.role_id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || '1h' }
    );
};

// Helper function: Handle errors
const handleError = (res, message, error, statusCode = 500) => {
    console.error(`${message}:`, error);
    res.status(statusCode).json({ message, error: error.message || error });
};

// Register a new user
const register = async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the user already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Default role: Member
        const roleId = role === 'Admin' ? 1 : role === 'Pastor' ? 2 : role === 'Volunteer' ? 3 : 4;

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await createUser({ username, email, passwordHash, roleId });

        res.status(201).json({
            message: 'Registration successful',
            user: {
                id: newUser.user_id,
                username: newUser.username,
                email: newUser.email,
                role: role || 'Member',
            },
        });
    } catch (error) {
        handleError(res, 'Error registering user', error);
    }
};

// Authenticate a user
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Find the user by email
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = generateToken(user);

        // Map role IDs to role names
        const roleName = user.role_id === 1
            ? 'Admin'
            : user.role_id === 2
            ? 'Pastor'
            : user.role_id === 3
            ? 'Volunteer'
            : 'Member';

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email,
                role: roleName,
            },
        });
    } catch (error) {
        handleError(res, 'Error logging in', error);
    }
};

module.exports = { register, login };
