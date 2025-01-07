const db = require('../config/db');

// Fetch all cell ministries
exports.getAllCellMinistries = async () => {
    const query = `
        SELECT cm.*, m.first_name AS leader_first_name, m.last_name AS leader_last_name
        FROM CellMinistries cm
        LEFT JOIN Members m ON cm.leader_id = m.id
        ORDER BY cm.name;
    `;
    return db.query(query);
};

// Fetch cell ministry by ID
exports.getCellMinistryById = async (id) => {
    const query = `
        SELECT cm.*, m.first_name AS leader_first_name, m.last_name AS leader_last_name
        FROM CellMinistries cm
        LEFT JOIN Members m ON cm.leader_id = m.id
        WHERE cm.id = $1;
    `;
    return db.query(query, [id]);
};

// Add a new cell ministry
exports.addCellMinistry = async (cellMinistry) => {
    const query = `
        INSERT INTO CellMinistries (name, leader_id, description)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [cellMinistry.name, cellMinistry.leader_id || null, cellMinistry.description];
    return db.query(query, values);
};

// Update a cell ministry
exports.updateCellMinistry = async (id, cellMinistry) => {
    const query = `
        UPDATE CellMinistries
        SET name = $1, leader_id = $2, description = $3
        WHERE id = $4
        RETURNING *;
    `;
    const values = [cellMinistry.name, cellMinistry.leader_id || null, cellMinistry.description, id];
    return db.query(query, values);
};

// Delete a cell ministry
exports.deleteCellMinistry = async (id) => {
    const query = `DELETE FROM CellMinistries WHERE id = $1 RETURNING *;`;
    return db.query(query, [id]);
};
