const db = require('../config/db');

// ---------- Volunteers ----------
exports.getAllVolunteers = async (req, res) => {
    try {
        const query = `SELECT * FROM Volunteers ORDER BY first_name, last_name;`;
        const volunteers = await db.query(query);
        res.status(200).json(volunteers.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching volunteers', error: error.message });
    }
};

exports.createVolunteer = async (req, res) => {
    const { first_name, last_name, email, phone, role } = req.body;

    try {
        const query = `
            INSERT INTO Volunteers (first_name, last_name, email, phone, role)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `;
        const values = [first_name, last_name, email, phone, role];
        const newVolunteer = await db.query(query, values);
        res.status(201).json(newVolunteer.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error creating volunteer', error: error.message });
    }
};

exports.updateVolunteer = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, phone, role } = req.body;

    try {
        const query = `
            UPDATE Volunteers
            SET first_name = $1, last_name = $2, email = $3, phone = $4, role = $5
            WHERE id = $6 RETURNING *;
        `;
        const values = [first_name, last_name, email, phone, role, id];
        const updatedVolunteer = await db.query(query, values);

        if (updatedVolunteer.rows.length === 0) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }

        res.status(200).json(updatedVolunteer.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating volunteer', error: error.message });
    }
};

exports.deleteVolunteer = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM Volunteers WHERE id = $1 RETURNING *;`;
        const deletedVolunteer = await db.query(query, [id]);

        if (deletedVolunteer.rows.length === 0) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }

        res.status(200).json(deletedVolunteer.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting volunteer', error: error.message });
    }
};

// ---------- Volunteer Schedule ----------
exports.getAllSchedules = async (req, res) => {
    try {
        const query = `
            SELECT vs.*, v.first_name AS volunteer_first_name, v.last_name AS volunteer_last_name, 
                   e.name AS event_name
            FROM VolunteerSchedule vs
            LEFT JOIN Volunteers v ON vs.volunteer_id = v.id
            LEFT JOIN Events e ON vs.event_id = e.id
            ORDER BY vs.schedule_date, vs.start_time;
        `;
        const schedules = await db.query(query);
        res.status(200).json(schedules.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schedules', error: error.message });
    }
};

exports.createSchedule = async (req, res) => {
    const { volunteer_id, task, event_id, schedule_date, start_time, end_time, notes } = req.body;

    try {
        const query = `
            INSERT INTO VolunteerSchedule (volunteer_id, task, event_id, schedule_date, start_time, end_time, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
        `;
        const values = [volunteer_id, task, event_id, schedule_date, start_time, end_time, notes];
        const newSchedule = await db.query(query, values);
        res.status(201).json(newSchedule.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error creating schedule', error: error.message });
    }
};

exports.updateSchedule = async (req, res) => {
    const { id } = req.params;
    const { task, schedule_date, start_time, end_time, notes } = req.body;

    try {
        const query = `
            UPDATE VolunteerSchedule
            SET task = $1, schedule_date = $2, start_time = $3, end_time = $4, notes = $5
            WHERE id = $6 RETURNING *;
        `;
        const values = [task, schedule_date, start_time, end_time, notes, id];
        const updatedSchedule = await db.query(query, values);

        if (updatedSchedule.rows.length === 0) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        res.status(200).json(updatedSchedule.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating schedule', error: error.message });
    }
};

exports.deleteSchedule = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM VolunteerSchedule WHERE id = $1 RETURNING *;`;
        const deletedSchedule = await db.query(query, [id]);

        if (deletedSchedule.rows.length === 0) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        res.status(200).json(deletedSchedule.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting schedule', error: error.message });
    }
};
