const givingModel = require('../models/givingModel');

// Fetch all giving records
exports.getAllGiving = async (req, res) => {
    try {
        const result = await givingModel.getAllGiving();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching giving records', error: error.message });
    }
};

// Add a new giving record
exports.addGiving = async (req, res) => {
    const { member_id, type, amount, transaction_id, payment_platform } = req.body;
    try {
        const result = await givingModel.addGiving(member_id, type, amount, transaction_id, payment_platform);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error adding giving record', error: error.message });
    }
};

// Fetch all pledges
exports.getAllPledges = async (req, res) => {
    try {
        const result = await givingModel.getAllPledges();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pledges', error: error.message });
    }
};

// Add a new pledge
exports.addPledge = async (req, res) => {
    const { member_id, purpose, amount, status } = req.body;
    try {
        const result = await givingModel.addPledge(member_id, purpose, amount, status);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error adding pledge', error: error.message });
    }
};
