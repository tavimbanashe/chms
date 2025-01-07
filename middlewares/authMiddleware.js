const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Middleware to authenticate user and check role permissions
exports.authenticate = (roles = []) => {
    return async (req, res, next) => {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (roles.length) {
                const userRole = await db.query('SELECT role_name FROM roles WHERE role_id = $1', [decoded.role_id]);
                if (!roles.includes(userRole.rows[0]?.role_name)) {
                    return res.status(403).json({ message: 'Forbidden: Access Denied' });
                }
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    };
};
