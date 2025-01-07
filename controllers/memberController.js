const memberModel = require('../models/memberModel');

// --- Members ---

// Get all members
exports.getAllMembers = async (req, res) => {
    try {
        const result = await memberModel.getAllMembers();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching members', error: error.message });
    }
};

// Get member by ID
exports.getMemberById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await memberModel.getMemberById(id);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching member', error: error.message });
    }
};

// Create a new member
exports.createMember = async (req, res) => {
    try {
        const result = await memberModel.createMember(req.body);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error creating member', error: error.message });
    }
};

// Update a member
exports.updateMember = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await memberModel.updateMember(id, req.body);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating member', error: error.message });
    }
};

// Delete a member
exports.deleteMember = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await memberModel.deleteMember(id);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting member', error: error.message });
    }
};

// --- Dropdown Data ---

// Get dropdown data
exports.getDropdownData = async (req, res) => {
    try {
        const [genders, memberTypes, groups, departments] = await memberModel.getDropdownData();
        res.status(200).json({
            genders: genders.rows,
            memberTypes: memberTypes.rows,
            groups: groups.rows,
            departments: departments.rows,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dropdown data', error: error.message });
    }
};

// Backend Controller: Updated MemberController
const db = require('../config/db');

// --- Members ---

// Fetch all members
exports.getAllMembers = async (req, res) => {
    try {
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
        const result = await db.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching members', error: error.message });
    }
};

// Fetch first timers
exports.getFirstTimers = async (req, res) => {
    try {
        const query = `
            SELECT 
                ft.id AS id, -- Unique identifier
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
        const result = await db.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching first timers', error: error.message });
    }
};

// Add a first timer
exports.addFirstTimer = async (req, res) => {
    const { member_id, first_visit_date, follow_up_notes, follow_up_date } = req.body;
    try {
        const query = `
            INSERT INTO FirstTimers (member_id, first_visit_date, follow_up_notes, follow_up_date)
            VALUES ($1, $2, $3, $4)
            RETURNING id, member_id, first_visit_date, follow_up_notes, follow_up_date;
        `;
        const values = [member_id, first_visit_date, follow_up_notes, follow_up_date];
        const result = await db.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error adding first timer', error: error.message });
    }
};

// Update a first timer
exports.updateFirstTimer = async (req, res) => {
    const { id } = req.params;
    const { first_visit_date, follow_up_notes, follow_up_date } = req.body;
    try {
        const query = `
            UPDATE FirstTimers 
            SET first_visit_date = $1, follow_up_notes = $2, follow_up_date = $3
            WHERE id = $4
            RETURNING id, member_id, first_visit_date, follow_up_notes, follow_up_date;
        `;
        const values = [first_visit_date, follow_up_notes, follow_up_date, id];
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'First timer not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating first timer', error: error.message });
    }
};

// Delete a first timer
exports.deleteFirstTimer = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `DELETE FROM FirstTimers WHERE id = $1 RETURNING id;`;
        const result = await db.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'First timer not found' });
        }
        res.status(200).json({ message: 'First timer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting first timer', error: error.message });
    }
};

// Fetch new converts
exports.getNewConverts = async (req, res) => {
    try {
        const query = `
            SELECT 
                nc.id AS id, -- Unique identifier
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
        const result = await db.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching new converts', error: error.message });
    }
};

// Add a new convert
exports.addNewConvert = async (req, res) => {
    const { member_id, conversion_date, assigned_counselor_id, discipleship_stage, progress_notes } = req.body;
    try {
        const query = `
            INSERT INTO NewConverts (member_id, conversion_date, assigned_counselor_id, discipleship_stage, progress_notes)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, member_id, conversion_date, assigned_counselor_id, discipleship_stage, progress_notes;
        `;
        const values = [member_id, conversion_date, assigned_counselor_id, discipleship_stage, progress_notes];
        const result = await db.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error adding new convert', error: error.message });
    }
};

// Update a new convert
exports.updateNewConvert = async (req, res) => {
    const { id } = req.params;
    const { conversion_date, assigned_counselor_id, discipleship_stage, progress_notes } = req.body;
    try {
        const query = `
            UPDATE NewConverts
            SET conversion_date = $1, assigned_counselor_id = $2, discipleship_stage = $3, progress_notes = $4
            WHERE id = $5
            RETURNING id, member_id, conversion_date, assigned_counselor_id, discipleship_stage, progress_notes;
        `;
        const values = [conversion_date, assigned_counselor_id, discipleship_stage, progress_notes, id];
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'New convert not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating new convert', error: error.message });
    }
};

// Delete a new convert
exports.deleteNewConvert = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `DELETE FROM NewConverts WHERE id = $1 RETURNING id;`;
        const result = await db.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'New convert not found' });
        }
        res.status(200).json({ message: 'New convert deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting new convert', error: error.message });
    }
};