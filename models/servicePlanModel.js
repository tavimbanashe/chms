const db = require('../config/db');

exports.getAllServicePlans = async () => {
    return db.query(`
        SELECT sp.*, m.first_name || ' ' || m.last_name AS coordinator
        FROM service_plans sp
        LEFT JOIN members m ON sp.coordinator_id = m.id
        ORDER BY sp.service_date DESC;
    `);
};

exports.getServicePlanById = async (id) => {
    return db.query(`
        SELECT sp.*, m.first_name || ' ' || m.last_name AS coordinator
        FROM service_plans sp
        LEFT JOIN members m ON sp.coordinator_id = m.id
        WHERE sp.id = $1;
    `, [id]);
};

exports.createServicePlan = async (data) => {
    const { service_date, service_type, theme, coordinator_id, notes } = data;
    return db.query(`
        INSERT INTO service_plans (service_date, service_type, theme, coordinator_id, notes)
        VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `, [service_date, service_type, theme, coordinator_id, notes]);
};

exports.updateServicePlan = async (id, data) => {
    const { service_date, service_type, theme, coordinator_id, notes } = data;
    return db.query(`
        UPDATE service_plans
        SET service_date = $1, service_type = $2, theme = $3, coordinator_id = $4, notes = $5
        WHERE id = $6 RETURNING *;
    `, [service_date, service_type, theme, coordinator_id, notes, id]);
};

exports.deleteServicePlan = async (id) => {
    return db.query('DELETE FROM service_plans WHERE id = $1 RETURNING *;', [id]);
};
