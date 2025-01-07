const db = require('../config/db');

// Log a communication (email or SMS)
exports.logCommunication = async (type, subject, message, recipients) => {
    const recipientList = Array.isArray(recipients) ? recipients.join(', ') : recipients;
    const query = `
        INSERT INTO CommunicationLogs (type, subject, message, recipients, sent_at)
        VALUES ($1, $2, $3, $4, NOW());
    `;
    const values = [type, subject, message, recipientList];
    return db.query(query, values);
};

// Fetch all communication logs
exports.getAllLogs = async () => {
    const query = `
        SELECT id, type, subject, message, recipients, sent_at
        FROM CommunicationLogs
        ORDER BY sent_at DESC;
    `;
    return db.query(query);
};
