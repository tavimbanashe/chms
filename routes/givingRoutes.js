const express = require('express');
const router = express.Router();
const givingController = require('../controllers/givingController');

// Routes for Giving
router.get('/giving', givingController.getAllGiving);
router.post('/giving', givingController.addGiving);

// Routes for Pledges
router.get('/pledges', givingController.getAllPledges);
router.post('/pledges', givingController.addPledge);

module.exports = router;
