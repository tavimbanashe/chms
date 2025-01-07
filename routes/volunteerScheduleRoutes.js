const express = require('express');
const router = express.Router();
const volunteerScheduleController = require('../controllers/volunteerScheduleController');

// Volunteer Schedule CRUD routes
router.get('/', volunteerScheduleController.getAllSchedules);
router.get('/:id', volunteerScheduleController.getScheduleById);
router.post('/', volunteerScheduleController.addSchedule);
router.put('/:id', volunteerScheduleController.updateSchedule);
router.delete('/:id', volunteerScheduleController.deleteSchedule);

module.exports = router;
