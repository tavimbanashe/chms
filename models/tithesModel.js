const db = require('../config/db');

exports.getAllTithes = async () => {
    return db.query(`
        SELECT t.*, m.first_name, m.last_name
        FROM Tithes t
        LEFT JOIN Members m ON t.member_id = m.id
        ORDER BY t.tithe_date DESC;
    `);
};

exports.createTithe = async (tithe) => {
    const { member_id, amount, tithe_date, notes } = tithe;
    return db.query(
        `
        INSERT INTO Tithes (member_id, amount, tithe_date, notes)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `,
        [member_id, amount, tithe_date, notes]
    );
};

exports.deleteTithe = async (id) => {
    return db.query(`DELETE FROM Tithes WHERE id = $1 RETURNING *;`, [id]);
};
