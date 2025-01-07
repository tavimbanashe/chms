const db = require('../config/db');

exports.getAllSpecialGivings = async () => {
    const query = `
        SELECT sg.*, m.first_name, m.last_name
        FROM special_givings sg
        LEFT JOIN members m ON sg.member_id = m.id
        ORDER BY sg.giving_date DESC;
    `;
    return await db.query(query);
};

exports.addSpecialGiving = async (specialGiving) => {
    const query = `
        INSERT INTO special_givings (member_id, amount, purpose, giving_date, notes)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const values = [
        specialGiving.member_id,
        specialGiving.amount,
        specialGiving.purpose,
        specialGiving.giving_date,
        specialGiving.notes,
    ];
    return await db.query(query, values);
};

exports.deleteSpecialGiving = async (id) => {
    const query = `DELETE FROM special_givings WHERE id = $1;`;
    return await db.query(query, [id]);
};
