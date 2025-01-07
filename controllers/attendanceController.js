const attendanceModel = require('../models/attendanceModel');

// Get all attendance records
exports.getAllAttendanceRecords = async (req, res) => {
    try {
        const result = await attendanceModel.getAllAttendanceRecords();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attendance records', error: error.message });
    }
};

// Get an attendance record by ID
exports.getAttendanceRecordById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await attendanceModel.getAttendanceRecordById(id);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attendance record', error: error.message });
    }
};

// Add a new attendance record
exports.addAttendanceRecord = async (req, res) => {
    try {
        const result = await attendanceModel.addAttendanceRecord(req.body);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error adding attendance record', error: error.message });
    }
};

// Update an attendance record
exports.updateAttendanceRecord = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await attendanceModel.updateAttendanceRecord(id, req.body);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating attendance record', error: error.message });
    }
};

// Delete an attendance record
exports.deleteAttendanceRecord = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await attendanceModel.deleteAttendanceRecord(id);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting attendance record', error: error.message });
    }
};
