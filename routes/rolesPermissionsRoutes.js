const express = require('express');
const router = express.Router();
const rolesPermissionsController = require('../controllers/rolesPermissionsController');
const { authenticate } = require('../middlewares/authMiddleware');

// Fetch all roles (Admin and Pastor roles can access)
router.get('/roles', authenticate(['Admin', 'Pastor']), rolesPermissionsController.getAllRoles);

// Fetch all permissions (Admin role only)
router.get('/permissions', authenticate(['Admin']), rolesPermissionsController.getAllPermissions);

// Assign permissions to a role (Admin role only)
router.post('/role-permissions', authenticate(['Admin']), rolesPermissionsController.assignPermissionToRole);

// Get permissions for a specific role (Admin and Pastor roles can access)
router.get('/role-permissions/:role_id', authenticate(['Admin', 'Pastor']), rolesPermissionsController.getPermissionsForRole);

module.exports = router;
