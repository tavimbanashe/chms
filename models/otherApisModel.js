const db = require('../config/db');

exports.logApiRequest = async (apiName, requestPayload, responsePayload, statusCode) => {
    return db.query(
        `INSERT INTO api_logs (api_name, request_payload, response_payload, status_code) 
        VALUES ($1, $2, $3, $4) RETURNING *`,
        [apiName, requestPayload, responsePayload, statusCode]
    );
};
