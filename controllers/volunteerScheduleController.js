const volunteerScheduleModel = require('../models/volunteerScheduleModel');

// Get all schedules
exports.getAllSchedules = async (req, res) => {
    try {
        const result = await volunteerScheduleModel.getAllSchedules();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schedules', error: error.message });
    }
};

// Get a schedule by ID
exports.getScheduleById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await volunteerScheduleModel.getScheduleById(id);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schedule', error: error.message });
    }
};

// Add a new schedule
exports.addSchedule = async (req, res) => {
    try {
        const result = await volunteerScheduleModel.addSchedule(req.body);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error adding schedule', error: error.message });
    }
};

// Update a schedule
exports.updateSchedule = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await volunteerScheduleModel.updateSchedule(id, req.body);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating schedule', error: error.message });
    }
};

// Delete a schedule
exports.deleteSchedule = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await volunteerScheduleModel.deleteSchedule(id);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting schedule', error: error.message });
    }
};
