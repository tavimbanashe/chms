// calendarController.js
const db = require('../config/db');

// Fetch all calendar events
exports.getAllEvents = async (req, res) => {
    try {
        const query = 'SELECT * FROM CalendarEvents ORDER BY start_date ASC;';
        const events = await db.query(query);
        res.status(200).json(events.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

// Create a new calendar event
exports.createEvent = async (req, res) => {
    const { title, description, start_date, end_date, is_recurring, recurrence_rule } = req.body;
    try {
        const query = `
            INSERT INTO CalendarEvents (title, description, start_date, end_date, is_recurring, recurrence_rule)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
        `;
        const values = [
            title,
            description,
            start_date,
            end_date,
            is_recurring || false,
            recurrence_rule || null,
        ];
        const newEvent = await db.query(query, values);
        res.status(201).json(newEvent.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
};

// Update an existing calendar event
exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, description, start_date, end_date, is_recurring, recurrence_rule } = req.body;
    try {
        const query = `
            UPDATE CalendarEvents
            SET title = $1, description = $2, start_date = $3, end_date = $4, is_recurring = $5, recurrence_rule = $6
            WHERE id = $7 RETURNING *;
        `;
        const values = [title, description, start_date, end_date, is_recurring, recurrence_rule, id];
        const updatedEvent = await db.query(query, values);
        if (updatedEvent.rows.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(updatedEvent.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
};

// Delete a calendar event
exports.deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM CalendarEvents WHERE id = $1 RETURNING *;';
        const deletedEvent = await db.query(query, [id]);
        if (deletedEvent.rows.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(deletedEvent.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
};