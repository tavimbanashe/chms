const pool = require('../config/db'); // Directly import pool, as it's exported directly

// Fetch all events
exports.getAllEvents = async () => {
    const query = 'SELECT * FROM events ORDER BY date DESC';
    return await db.query(query);
};

// Add a new event
exports.createEvent = async (name, date, description) => {
    const query = 'INSERT INTO events (name, date, description) VALUES ($1, $2, $3) RETURNING *';
    return await db.query(query, [name, date, description]);
};

// Update an event
exports.updateEvent = async (id, name, date, description) => {
    const query = `
        UPDATE events
        SET name = $1, date = $2, description = $3
        WHERE id = $4 RETURNING *`;
    return await db.query(query, [name, date, description, id]);
};

// Delete an event
exports.deleteEvent = async (id) => {
    const query = 'DELETE FROM events WHERE id = $1';
    return await db.query(query, [id]);
};
