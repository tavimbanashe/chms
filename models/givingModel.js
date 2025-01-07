const db = require('../config/db');

// Fetch all giving records
exports.getAllGiving = async () => {
    const query = `
        SELECT g.*, m.first_name || ' ' || m.last_name AS member_name
        FROM Giving g
        JOIN Members m ON g.member_id = m.id
        ORDER BY g.date DESC;
    `;
    return db.query(query);
};

// Add a new giving record
exports.addGiving = async (member_id, type, amount, transaction_id, payment_platform) => {
    const query = `
        INSERT INTO Giving (member_id, type, amount, transaction_id, payment_platform)
        VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    return db.query(query, [member_id, type, amount, transaction_id, payment_platform]);
};

// Fetch all pledges
exports.getAllPledges = async () => {
    const query = `
        SELECT p.*, m.first_name || ' ' || m.last_name AS member_name
        FROM Pledges p
        JOIN Members m ON p.member_id = m.id
        ORDER BY p.date DESC;
    `;
    return db.query(query);
};

// Add a new pledge
exports.addPledge = async (member_id, purpose, amount, status) => {
    const query = `
        INSERT INTO Pledges (member_id, purpose, amount, status)
        VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    return db.query(query, [member_id, purpose, amount, status]);
};
