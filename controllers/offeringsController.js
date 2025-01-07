const offeringsModel = require('../models/offeringsModel');

exports.getAllOfferings = async (req, res) => {
    try {
        const offerings = await offeringsModel.getAllOfferings();
        res.status(200).json(offerings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch offerings' });
    }
};

exports.addOffering = async (req, res) => {
    const { giver_name, email, amount, offering_date, notes } = req.body;
    try {
        const newOffering = await offeringsModel.addOffering(giver_name, email, amount, offering_date, notes);
        res.status(201).json(newOffering);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add offering' });
    }
};

exports.updateOffering = async (req, res) => {
    const { id } = req.params;
    const { giver_name, email, amount, offering_date, notes } = req.body;
    try {
        const updatedOffering = await offeringsModel.updateOffering(id, giver_name, email, amount, offering_date, notes);
        res.status(200).json(updatedOffering);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update offering' });
    }
};

exports.deleteOffering = async (req, res) => {
    const { id } = req.params;
    try {
        await offeringsModel.deleteOffering(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete offering' });
    }
};
