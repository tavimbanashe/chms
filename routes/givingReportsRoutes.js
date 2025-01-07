const express = require('express');
const router = express.Router();
const givingReportsController = require('../controllers/givingReportsController');

// Giving Reports Routes
router.get('/', givingReportsController.getAllGivingReports);
router.get('/summary', givingReportsController.getGivingSummary);
router.post('/', givingReportsController.createGivingReport);
router.put('/:id', givingReportsController.updateGivingReport);
router.delete('/:id', givingReportsController.deleteGivingReport);

module.exports = router;
