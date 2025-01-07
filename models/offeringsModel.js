const db = require('../config/db');

exports.getAllOfferings = async () => {
    const query = 'SELECT * FROM offerings ORDER BY offering_date DESC';
    const { rows } = await db.query(query);
    return rows;
};

exports.addOffering = async (giver_name, email, amount, offering_date, notes) => {
    const query = `
        INSERT INTO offerings (giver_name, email, amount, offering_date, notes) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    const { rows } = await db.query(query, [giver_name, email, amount, offering_date, notes]);
    return rows[0];
};

exports.updateOffering = async (id, giver_name, email, amount, offering_date, notes) => {
    const query = `
        UPDATE offerings 
        SET giver_name = $1, email = $2, amount = $3, offering_date = $4, notes = $5 
        WHERE id = $6 RETURNING *
    `;
    const { rows } = await db.query(query, [giver_name, email, amount, offering_date, notes, id]);
    return rows[0];
};

exports.deleteOffering = async (id) => {
    const query = 'DELETE FROM offerings WHERE id = $1';
    await db.query(query, [id]);
};
