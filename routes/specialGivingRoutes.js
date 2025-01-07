const express = require('express');
const router = express.Router();
const specialGivingController = require('../controllers/specialGivingController');

router.get('/', specialGivingController.getSpecialGivings);
router.post('/', specialGivingController.addSpecialGiving);
router.delete('/:id', specialGivingController.deleteSpecialGiving);

module.exports = router;
