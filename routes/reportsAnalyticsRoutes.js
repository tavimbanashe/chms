const express = require('express');
const router = express.Router();
const reportsAnalyticsController = require('../controllers/reportsAnalyticsController');

// Route to fetch all reports and analytics data
router.get('/', reportsAnalyticsController.getAllReportsAnalytics);

// Additional routes for specific analytics (if needed)
router.get('/summary', reportsAnalyticsController.getSummary);
router.get('/:id', reportsAnalyticsController.getReportById);

module.exports = router;
