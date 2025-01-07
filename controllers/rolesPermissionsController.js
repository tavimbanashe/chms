const db = require('../config/db');

// Fetch all roles
exports.getAllRoles = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM roles');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ message: 'Error fetching roles' });
    }
};

// Fetch all permissions
exports.getAllPermissions = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM permissions');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching permissions:', error);
        res.status(500).json({ message: 'Error fetching permissions' });
    }
};

// Assign permission to role
exports.assignPermissionToRole = async (req, res) => {
    const { role_id, permission_id } = req.body;

    try {
        await db.query(
            'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)',
            [role_id, permission_id]
        );
        res.status(201).json({ message: 'Permission assigned to role successfully' });
    } catch (error) {
        console.error('Error assigning permission:', error);
        res.status(500).json({ message: 'Error assigning permission' });
    }
};

// Fetch permissions for a role
exports.getPermissionsForRole = async (req, res) => {
    const { role_id } = req.params;

    try {
        const result = await db.query(
            `SELECT p.permission_name
             FROM permissions p
             INNER JOIN role_permissions rp ON rp.permission_id = p.permission_id
             WHERE rp.role_id = $1`,
            [role_id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching permissions for role:', error);
        res.status(500).json({ message: 'Error fetching permissions' });
    }
};
