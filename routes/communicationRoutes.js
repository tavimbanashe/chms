const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');

// Route to fetch recipients
router.get('/recipients', communicationController.getRecipients);

// Other routes for sending email/SMS
router.post('/send/email', communicationController.sendBulkEmail);
router.post('/send/sms', communicationController.sendBulkSMS);
router.get('/logs', communicationController.getAllLogs);

module.exports = router;
