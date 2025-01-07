const express = require('express');
const router = express.Router();
const onlineGivingController = require('../controllers/onlineGivingController');

// Donation creation endpoint
router.post('/', onlineGivingController.processPayment);

// Fetch all donations
router.get('/', onlineGivingController.getAllDonations);

// Webhook routes
router.post('/webhook/paypal', onlineGivingController.paypalWebhook);
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), onlineGivingController.stripeWebhook);

module.exports = router;
