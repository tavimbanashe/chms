const express = require('express');
const router = express.Router();
const cellMinistryController = require('../controllers/cellMinistryController');

// Get all cell ministries
router.get('/', cellMinistryController.getAllCellMinistries);

// Get a single cell ministry by ID
router.get('/:id', cellMinistryController.getCellMinistryById);

// Add a new cell ministry
router.post('/', cellMinistryController.addCellMinistry);

// Update a cell ministry by ID
router.put('/:id', cellMinistryController.updateCellMinistry);

// Delete a cell ministry by ID
router.delete('/:id', cellMinistryController.deleteCellMinistry);

module.exports = router;
