const cellMinistryModel = require('../models/cellMinistryModel');

// Get all cell ministries
exports.getAllCellMinistries = async (req, res) => {
    try {
        const result = await cellMinistryModel.getAllCellMinistries();
        res.status(200).json(result.rows);  // Ensure the model method returns result.rows
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cell ministries', error: error.message });
    }
};

// Get a cell ministry by ID
exports.getCellMinistryById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await cellMinistryModel.getCellMinistryById(id);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cell ministry not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cell ministry', error: error.message });
    }
};

// Add a new cell ministry
exports.addCellMinistry = async (req, res) => {
    try {
        const result = await cellMinistryModel.addCellMinistry(req.body);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error adding cell ministry', error: error.message });
    }
};

// Update a cell ministry
exports.updateCellMinistry = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await cellMinistryModel.updateCellMinistry(id, req.body);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cell ministry not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating cell ministry', error: error.message });
    }
};

// Delete a cell ministry
exports.deleteCellMinistry = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await cellMinistryModel.deleteCellMinistry(id);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cell ministry not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting cell ministry', error: error.message });
    }
};
