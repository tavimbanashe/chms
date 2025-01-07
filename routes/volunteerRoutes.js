const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');

// Volunteer Routes
router.get('/volunteers', volunteerController.getAllVolunteers);
router.post('/volunteers', volunteerController.createVolunteer);
router.put('/volunteers/:id', volunteerController.updateVolunteer);
router.delete('/volunteers/:id', volunteerController.deleteVolunteer);

// Volunteer Schedule Routes
router.get('/schedule', volunteerController.getAllSchedules);
router.post('/schedule', volunteerController.createSchedule);
router.put('/schedule/:id', volunteerController.updateSchedule);
router.delete('/schedule/:id', volunteerController.deleteSchedule);

module.exports = router;
