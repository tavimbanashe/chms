const db = require('../config/db');

// Get all attendance records
exports.getAllAttendanceRecords = async () => {
    const query = `
        SELECT 
            ar.id,
            ar.member_id,
            m.first_name,
            m.last_name,
            ar.service_date,
            ar.attended,
            ar.notes
        FROM AttendanceRecords ar
        JOIN Members m ON ar.member_id = m.id
        ORDER BY ar.service_date DESC, m.last_name, m.first_name;
    `;
    return db.query(query);
};

// Get attendance record by ID
exports.getAttendanceRecordById = async (id) => {
    const query = `
        SELECT 
            ar.id,
            ar.member_id,
            m.first_name,
            m.last_name,
            ar.service_date,
            ar.attended,
            ar.notes
        FROM AttendanceRecords ar
        JOIN Members m ON ar.member_id = m.id
        WHERE ar.id = $1;
    `;
    return db.query(query, [id]);
};

// Add a new attendance record
exports.addAttendanceRecord = async (record) => {
    const query = `
        INSERT INTO AttendanceRecords (member_id, service_date, attended, notes)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [
        record.member_id,
        record.service_date,
        record.attended,
        record.notes || '',
    ];
    return db.query(query, values);
};

// Update an attendance record
exports.updateAttendanceRecord = async (id, record) => {
    const query = `
        UPDATE AttendanceRecords
        SET member_id = $1, service_date = $2, attended = $3, notes = $4
        WHERE id = $5
        RETURNING *;
    `;
    const values = [
        record.member_id,
        record.service_date,
        record.attended,
        record.notes || '',
        id,
    ];
    return db.query(query, values);
};

// Delete an attendance record
exports.deleteAttendanceRecord = async (id) => {
    const query = `DELETE FROM AttendanceRecords WHERE id = $1 RETURNING *;`;
    return db.query(query, [id]);
};
