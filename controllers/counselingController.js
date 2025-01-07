const db = require('../config/db');

exports.getAllSessions = async (req, res) => {
    try {
        const query = `
            SELECT cs.*, m.first_name AS member_first_name, m.last_name AS member_last_name,
                   c.first_name AS counselor_first_name, c.last_name AS counselor_last_name
            FROM CounselingSessions cs
            LEFT JOIN Members m ON cs.member_id = m.id
            LEFT JOIN Counselors c ON cs.counselor_id = c.id
            ORDER BY cs.session_date DESC;
        `;
        const sessions = await db.query(query);
        res.status(200).json(sessions.rows);
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ message: 'Error fetching sessions', error: error.message });
    }
};

exports.createSession = async (req, res) => {
    const { member_id, counselor_id, session_date, notes, status } = req.body;

    try {
        const query = `
            INSERT INTO CounselingSessions (member_id, counselor_id, session_date, notes, status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [member_id, counselor_id, session_date, notes, status || 'Scheduled'];
        const newSession = await db.query(query, values);
        res.status(201).json(newSession.rows[0]);
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ message: 'Error creating session', error: error.message });
    }
};

exports.updateSession = async (req, res) => {
    const { id } = req.params;
    const { session_date, notes, status } = req.body;

    try {
        const query = `
            UPDATE CounselingSessions
            SET session_date = $1, notes = $2, status = $3
            WHERE id = $4
            RETURNING *;
        `;
        const values = [session_date, notes, status, id];
        const updatedSession = await db.query(query, values);

        if (updatedSession.rows.length === 0) {
            return res.status(404).json({ message: 'Session not found' });
        }

        res.status(200).json(updatedSession.rows[0]);
    } catch (error) {
        console.error('Error updating session:', error);
        res.status(500).json({ message: 'Error updating session', error: error.message });
    }
};

exports.deleteSession = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM CounselingSessions WHERE id = $1 RETURNING *;`;
        const deletedSession = await db.query(query, [id]);

        if (deletedSession.rows.length === 0) {
            return res.status(404).json({ message: 'Session not found' });
        }

        res.status(200).json(deletedSession.rows[0]);
    } catch (error) {
        console.error('Error deleting session:', error);
        res.status(500).json({ message: 'Error deleting session', error: error.message });
    }
};

// ---------- Counselors ----------
exports.getAllCounselors = async (req, res) => {
    try {
        const query = `SELECT * FROM Counselors ORDER BY first_name, last_name;`;
        const counselors = await db.query(query);
        res.status(200).json(counselors.rows);
    } catch (error) {
        console.error('Error fetching counselors:', error);
        res.status(500).json({ message: 'Error fetching counselors', error: error.message });
    }
};

exports.createCounselor = async (req, res) => {
    const { first_name, last_name, email, phone, specialization } = req.body;

    try {
        const query = `
            INSERT INTO Counselors (first_name, last_name, email, phone, specialization)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [first_name, last_name, email, phone, specialization];
        const newCounselor = await db.query(query, values);
        res.status(201).json(newCounselor.rows[0]);
    } catch (error) {
        console.error('Error creating counselor:', error);
        res.status(500).json({ message: 'Error creating counselor', error: error.message });
    }
};

exports.updateCounselor = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, phone, specialization } = req.body;

    try {
        const query = `
            UPDATE Counselors
            SET first_name = $1, last_name = $2, email = $3, phone = $4, specialization = $5
            WHERE id = $6
            RETURNING *;
        `;
        const values = [first_name, last_name, email, phone, specialization, id];
        const updatedCounselor = await db.query(query, values);

        if (updatedCounselor.rows.length === 0) {
            return res.status(404).json({ message: 'Counselor not found' });
        }

        res.status(200).json(updatedCounselor.rows[0]);
    } catch (error) {
        console.error('Error updating counselor:', error);
        res.status(500).json({ message: 'Error updating counselor', error: error.message });
    }
};

exports.deleteCounselor = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM Counselors WHERE id = $1 RETURNING *;`;
        const deletedCounselor = await db.query(query, [id]);

        if (deletedCounselor.rows.length === 0) {
            return res.status(404).json({ message: 'Counselor not found' });
        }

        res.status(200).json(deletedCounselor.rows[0]);
    } catch (error) {
        console.error('Error deleting counselor:', error);
        res.status(500).json({ message: 'Error deleting counselor', error: error.message });
    }
};
