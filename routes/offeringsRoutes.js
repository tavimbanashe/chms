const express = require('express');
const router = express.Router();
const offeringsController = require('../controllers/offeringsController');

router.get('/', offeringsController.getAllOfferings);
router.post('/', offeringsController.addOffering);
router.put('/:id', offeringsController.updateOffering);
router.delete('/:id', offeringsController.deleteOffering);

module.exports = router;
