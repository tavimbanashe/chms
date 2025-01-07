const db = require('../config/db');

// Members - Get all members
exports.getAllMembers = async () => {
    const query = `
        SELECT 
            m.id,
            m.first_name,
            m.last_name,
            m.email,
            m.phone,
            m.address,
            m.date_of_birth,
            m.gender_id,
            g.name AS gender_name,
            m.member_type_id,
            mt.name AS member_type_name,
            m.group_id,
            grp.name AS group_name,
            m.department_id,
            d.name AS department_name,
            m.joined_at,
            m.last_payment_date,
            m.profile_picture_url,
            m.notes
        FROM Members m
        LEFT JOIN Gender g ON m.gender_id = g.id
        LEFT JOIN MemberType mt ON m.member_type_id = mt.id
        LEFT JOIN Groups grp ON m.group_id = grp.id
        LEFT JOIN Departments d ON m.department_id = d.id
        ORDER BY m.last_name, m.first_name;
    `;
    return db.query(query);
};

// Members - Get member by ID
exports.getMemberById = async (id) => {
    const query = `
        SELECT 
            m.id,
            m.first_name,
            m.last_name,
            m.email,
            m.phone,
            m.address,
            m.date_of_birth,
            m.gender_id,
            g.name AS gender_name,
            m.member_type_id,
            mt.name AS member_type_name,
            m.group_id,
            grp.name AS group_name,
            m.department_id,
            d.name AS department_name,
            m.joined_at,
            m.last_payment_date,
            m.profile_picture_url,
            m.notes
        FROM Members m
        LEFT JOIN Gender g ON m.gender_id = g.id
        LEFT JOIN MemberType mt ON m.member_type_id = mt.id
        LEFT JOIN Groups grp ON m.group_id = grp.id
        LEFT JOIN Departments d ON m.department_id = d.id
        WHERE m.id = $1;
    `;
    return db.query(query, [id]);
};

// Members - Create a member
exports.createMember = async (member) => {
    const query = `
        INSERT INTO Members 
        (first_name, last_name, email, phone, address, date_of_birth, gender_id, member_type_id, group_id, department_id, joined_at, last_payment_date, profile_picture_url, notes) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
        RETURNING *;
    `;
    const values = [
        member.first_name,
        member.last_name,
        member.email,
        member.phone,
        member.address,
        member.date_of_birth,
        member.gender_id,
        member.member_type_id,
        member.group_id,
        member.department_id,
        member.joined_at || new Date(),
        member.last_payment_date || null,
        member.profile_picture_url || null,
        member.notes || '',
    ];
    return db.query(query, values);
};

// Members - Update a member
exports.updateMember = async (id, member) => {
    const query = `
        UPDATE Members 
        SET first_name = $1, last_name = $2, email = $3, phone = $4, address = $5, date_of_birth = $6, gender_id = $7, 
            member_type_id = $8, group_id = $9, department_id = $10, joined_at = $11, last_payment_date = $12, 
            profile_picture_url = $13, notes = $14
        WHERE id = $15 
        RETURNING *;
    `;
    const values = [
        member.first_name,
        member.last_name,
        member.email,
        member.phone,
        member.address,
        member.date_of_birth,
        member.gender_id,
        member.member_type_id,
        member.group_id,
        member.department_id,
        member.joined_at || new Date(),
        member.last_payment_date || null,
        member.profile_picture_url || null,
        member.notes || '',
        id,
    ];
    return db.query(query, values);
};

// Members - Delete a member
exports.deleteMember = async (id) => {
    const query = `DELETE FROM Members WHERE id = $1 RETURNING *;`;
    return db.query(query, [id]);
};

// Dropdown Data
exports.getDropdownData = async () => {
    const genders = db.query('SELECT id, name FROM Gender ORDER BY name;');
    const memberTypes = db.query('SELECT id, name FROM MemberType ORDER BY name;');
    const groups = db.query('SELECT id, name FROM Groups ORDER BY name;');
    const departments = db.query('SELECT id, name FROM Departments ORDER BY name;');

    return Promise.all([genders, memberTypes, groups, departments]);
};



// Fetch all first timers
exports.getFirstTimers = async () => {
    const query = `
        SELECT 
            ft.id AS first_timer_id,
            ft.member_id,
            ft.first_visit_date,
            ft.follow_up_notes,
            ft.follow_up_date,
            m.first_name,
            m.last_name,
            m.email
        FROM FirstTimers ft
        JOIN Members m ON ft.member_id = m.id
        ORDER BY ft.first_visit_date DESC;
    `;
    return db.query(query);
};


// Add a first timer
exports.addFirstTimer = async (firstTimer) => {
    const query = `
        INSERT INTO FirstTimers (member_id, first_visit_date, follow_up_notes, follow_up_date)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [
        firstTimer.member_id,
        firstTimer.first_visit_date,
        firstTimer.follow_up_notes,
        firstTimer.follow_up_date,
    ];
    return db.query(query, values);
};

// Update a first timer
exports.updateFirstTimer = async (id, firstTimer) => {
    const query = `
        UPDATE FirstTimers 
        SET first_visit_date = $1, follow_up_notes = $2, follow_up_date = $3
        WHERE id = $4
        RETURNING *;
    `;
    const values = [
        firstTimer.first_visit_date,
        firstTimer.follow_up_notes,
        firstTimer.follow_up_date,
        id,
    ];
    return db.query(query, values);
};

// Delete a first timer
exports.deleteFirstTimer = async (id) => {
    const query = `DELETE FROM FirstTimers WHERE id = $1 RETURNING *;`;
    return db.query(query, [id]);
};


// Fetch all new converts
exports.getNewConverts = async () => {
    const query = `
        SELECT 
            nc.id AS new_convert_id,
            nc.member_id,
            nc.conversion_date,
            nc.assigned_counselor_id,
            c.first_name AS counselor_first_name,
            c.last_name AS counselor_last_name,
            nc.discipleship_stage,
            nc.progress_notes,
            m.first_name,
            m.last_name,
            m.email
        FROM NewConverts nc
        JOIN Members m ON nc.member_id = m.id
        LEFT JOIN Members c ON nc.assigned_counselor_id = c.id
        ORDER BY nc.conversion_date DESC;
    `;
    return db.query(query);
};


// Add a new convert
exports.addNewConvert = async (newConvert) => {
    const query = `
        INSERT INTO NewConverts (member_id, conversion_date, assigned_counselor_id, discipleship_stage, progress_notes)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const values = [
        newConvert.member_id,
        newConvert.conversion_date,
        newConvert.assigned_counselor_id || null,
        newConvert.discipleship_stage,
        newConvert.progress_notes,
    ];
    return db.query(query, values);
};

// Update a new convert
exports.updateNewConvert = async (id, newConvert) => {
    const query = `
        UPDATE NewConverts
        SET conversion_date = $1, assigned_counselor_id = $2, discipleship_stage = $3, progress_notes = $4
        WHERE id = $5
        RETURNING *;
    `;
    const values = [
        newConvert.conversion_date,
        newConvert.assigned_counselor_id || null,
        newConvert.discipleship_stage,
        newConvert.progress_notes,
        id,
    ];
    return db.query(query, values);
};

// Delete a new convert
exports.deleteNewConvert = async (id) => {
    const query = `DELETE FROM NewConverts WHERE id = $1 RETURNING *;`;
    return db.query(query, [id]);
};
