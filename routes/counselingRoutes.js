const express = require('express');
const router = express.Router();
const counselingController = require('../controllers/counselingController');

// Counseling Sessions
router.get('/sessions', counselingController.getAllSessions);
router.post('/sessions', counselingController.createSession);
router.put('/sessions/:id', counselingController.updateSession);
router.delete('/sessions/:id', counselingController.deleteSession);

// Counselors
router.get('/counselors', counselingController.getAllCounselors);
router.post('/counselors', counselingController.createCounselor);
router.put('/counselors/:id', counselingController.updateCounselor);
router.delete('/counselors/:id', counselingController.deleteCounselor);

module.exports = router;
