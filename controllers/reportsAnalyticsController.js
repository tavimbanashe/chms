const db = require('../config/db');

// Fetch all reports and analytics data
exports.getAllReportsAnalytics = async (req, res) => {
    try {
        const query = `
            SELECT id, type, date, details, COUNT(*) AS count 
            FROM reports 
            GROUP BY id, type, date, details
            ORDER BY date DESC;
        `;
        const { rows } = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Error fetching reports', error: error.message });
    }
};

// Fetch summary data for analytics
exports.getSummary = async (req, res) => {
    try {
        const query = `
            SELECT type, COUNT(*) AS total_count 
            FROM reports 
            GROUP BY type;
        `;
        const { rows } = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching summary data:', error);
        res.status(500).json({ message: 'Error fetching summary', error: error.message });
    }
};

// Fetch a specific report by ID
exports.getReportById = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT id, type, date, details 
            FROM reports 
            WHERE id = $1;
        `;
        const { rows } = await db.query(query, [id]);

        if (rows.length === 0) {
            res.status(404).json({ message: 'Report not found' });
        } else {
            res.status(200).json(rows[0]);
        }
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ message: 'Error fetching report', error: error.message });
    }
};
