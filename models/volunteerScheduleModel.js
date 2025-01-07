const db = require('../config/db');

// Get all volunteer schedules
exports.getAllSchedules = async () => {
    const query = `
        SELECT 
            vs.id,
            vs.member_id,
            m.first_name,
            m.last_name,
            vs.event_date,
            vs.role,
            vs.notes
        FROM VolunteerSchedules vs
        JOIN Members m ON vs.member_id = m.id
        ORDER BY vs.event_date DESC, m.last_name, m.first_name;
    `;
    return db.query(query);
};

// Get a schedule by ID
exports.getScheduleById = async (id) => {
    const query = `
        SELECT 
            vs.id,
            vs.member_id,
            m.first_name,
            m.last_name,
            vs.event_date,
            vs.role,
            vs.notes
        FROM VolunteerSchedules vs
        JOIN Members m ON vs.member_id = m.id
        WHERE vs.id = $1;
    `;
    return db.query(query, [id]);
};

// Add a new schedule
exports.addSchedule = async (schedule) => {
    const query = `
        INSERT INTO VolunteerSchedules (member_id, event_date, role, notes)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [
        schedule.member_id,
        schedule.event_date,
        schedule.role,
        schedule.notes || '',
    ];
    return db.query(query, values);
};

// Update a schedule
exports.updateSchedule = async (id, schedule) => {
    const query = `
        UPDATE VolunteerSchedules
        SET member_id = $1, event_date = $2, role = $3, notes = $4
        WHERE id = $5
        RETURNING *;
    `;
    const values = [
        schedule.member_id,
        schedule.event_date,
        schedule.role,
        schedule.notes || '',
        id,
    ];
    return db.query(query, values);
};

// Delete a schedule
exports.deleteSchedule = async (id) => {
    const query = `DELETE FROM VolunteerSchedules WHERE id = $1 RETURNING *;`;
    return db.query(query, [id]);
};
