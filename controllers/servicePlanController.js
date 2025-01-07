const servicePlanModel = require('../models/servicePlanModel');

exports.getAllServicePlans = async (req, res) => {
    try {
        const result = await servicePlanModel.getAllServicePlans();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching service plans', error: error.message });
    }
};

exports.getServicePlanById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await servicePlanModel.getServicePlanById(id);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Service plan not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching service plan', error: error.message });
    }
};

exports.createServicePlan = async (req, res) => {
    try {
        const result = await servicePlanModel.createServicePlan(req.body);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error creating service plan', error: error.message });
    }
};

exports.updateServicePlan = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await servicePlanModel.updateServicePlan(id, req.body);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Service plan not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating service plan', error: error.message });
    }
};

exports.deleteServicePlan = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await servicePlanModel.deleteServicePlan(id);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Service plan not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting service plan', error: error.message });
    }
};
