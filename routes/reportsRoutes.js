const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

router.post('/data', reportsController.getReportData);
router.post('/export', reportsController.exportReport);

module.exports = router;
