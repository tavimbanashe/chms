const eventModel = require('../models/eventModel');

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const result = await eventModel.getAllEvents();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

// Create a new event
exports.createEvent = async (req, res) => {
    const { name, date, description } = req.body;
    try {
        const result = await eventModel.createEvent(name, date, description);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
};

// Update an event
exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const { name, date, description } = req.body;
    try {
        const result = await eventModel.updateEvent(id, name, date, description);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        await eventModel.deleteEvent(id);
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
};
