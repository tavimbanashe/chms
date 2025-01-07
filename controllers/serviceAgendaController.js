const db = require('../config/db');

// ---------- Service Agenda ----------
exports.getAllAgendas = async (req, res) => {
    try {
        const query = `
            SELECT * FROM ServiceAgenda
            ORDER BY service_date ASC, start_time ASC;
        `;
        const agendas = await db.query(query);
        res.status(200).json(agendas.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching agendas', error: error.message });
    }
};

exports.createAgenda = async (req, res) => {
    const { service_date, title, description, start_time, end_time } = req.body;

    try {
        const query = `
            INSERT INTO ServiceAgenda (service_date, title, description, start_time, end_time)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `;
        const values = [service_date, title, description, start_time, end_time];
        const newAgenda = await db.query(query, values);
        res.status(201).json(newAgenda.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error creating agenda', error: error.message });
    }
};

exports.updateAgenda = async (req, res) => {
    const { id } = req.params;
    const { service_date, title, description, start_time, end_time } = req.body;

    try {
        const query = `
            UPDATE ServiceAgenda
            SET service_date = $1, title = $2, description = $3, start_time = $4, end_time = $5
            WHERE id = $6 RETURNING *;
        `;
        const values = [service_date, title, description, start_time, end_time, id];
        const updatedAgenda = await db.query(query, values);

        if (updatedAgenda.rows.length === 0) {
            return res.status(404).json({ message: 'Agenda item not found' });
        }

        res.status(200).json(updatedAgenda.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating agenda', error: error.message });
    }
};

exports.deleteAgenda = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM ServiceAgenda WHERE id = $1 RETURNING *;`;
        const deletedAgenda = await db.query(query, [id]);

        if (deletedAgenda.rows.length === 0) {
            return res.status(404).json({ message: 'Agenda item not found' });
        }

        res.status(200).json(deletedAgenda.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting agenda', error: error.message });
    }
};
