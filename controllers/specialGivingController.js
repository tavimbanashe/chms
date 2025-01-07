const specialGivingModel = require('../models/specialGivingModel');

exports.getSpecialGivings = async (req, res) => {
    try {
        const result = await specialGivingModel.getAllSpecialGivings();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching special givings', error: error.message });
    }
};

exports.addSpecialGiving = async (req, res) => {
    try {
        const result = await specialGivingModel.addSpecialGiving(req.body);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error adding special giving', error: error.message });
    }
};

exports.deleteSpecialGiving = async (req, res) => {
    try {
        await specialGivingModel.deleteSpecialGiving(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting special giving', error: error.message });
    }
};
