const db = require('../config/db');

// ---------- Giving Reports ----------

exports.getAllGivingReports = async (req, res) => {
    try {
        const query = `
            SELECT gr.*, m.first_name, m.last_name
            FROM GivingReports gr
            LEFT JOIN Members m ON gr.member_id = m.id
            ORDER BY giving_date DESC;
        `;
        const reports = await db.query(query);

        if (reports.rows.length === 0) {
            return res.status(404).json({ message: 'No giving reports found' });
        }

        res.status(200).json(reports.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching giving reports', error: error.message });
    }
};

exports.getGivingSummary = async (req, res) => {
    try {
        const query = `
            SELECT type, SUM(amount) AS total_amount
            FROM GivingReports
            GROUP BY type
            ORDER BY total_amount DESC;
        `;
        const summary = await db.query(query);

        if (summary.rows.length === 0) {
            return res.status(404).json({ message: 'No summary data available' });
        }

        res.status(200).json(summary.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching giving summary', error: error.message });
    }
};



exports.createGivingReport = async (req, res) => {
    const { member_id, amount, giving_date, type, notes } = req.body;

    try {
        const query = `
            INSERT INTO GivingReports (member_id, amount, giving_date, type, notes)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `;
        const values = [member_id, amount, giving_date, type, notes];
        const newReport = await db.query(query, values);
        res.status(201).json(newReport.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error creating giving report', error: error.message });
    }
};

exports.updateGivingReport = async (req, res) => {
    const { id } = req.params;
    const { member_id, amount, giving_date, type, notes } = req.body;

    try {
        const query = `
            UPDATE GivingReports
            SET member_id = $1, amount = $2, giving_date = $3, type = $4, notes = $5
            WHERE id = $6 RETURNING *;
        `;
        const values = [member_id, amount, giving_date, type, notes, id];
        const updatedReport = await db.query(query, values);

        if (updatedReport.rows.length === 0) {
            return res.status(404).json({ message: 'Giving report not found' });
        }

        res.status(200).json(updatedReport.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating giving report', error: error.message });
    }
};

exports.deleteGivingReport = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM GivingReports WHERE id = $1 RETURNING *;`;
        const deletedReport = await db.query(query, [id]);

        if (deletedReport.rows.length === 0) {
            return res.status(404).json({ message: 'Giving report not found' });
        }

        res.status(200).json(deletedReport.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting giving report', error: error.message });
    }
};
