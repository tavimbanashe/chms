const tithesModel = require('../models/tithesModel');

exports.getAllTithes = async (req, res) => {
    try {
        const result = await tithesModel.getAllTithes();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tithes', error: error.message });
    }
};

exports.createTithe = async (req, res) => {
    try {
        const newTithe = req.body;
        const result = await tithesModel.createTithe(newTithe);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error creating tithe', error: error.message });
    }
};

exports.deleteTithe = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await tithesModel.deleteTithe(id);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Tithe not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting tithe', error: error.message });
    }
};
