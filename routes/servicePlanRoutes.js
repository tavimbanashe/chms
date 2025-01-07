const express = require('express');
const router = express.Router();
const servicePlanController = require('../controllers/servicePlanController');

router.get('/', servicePlanController.getAllServicePlans);
router.get('/:id', servicePlanController.getServicePlanById);
router.post('/', servicePlanController.createServicePlan);
router.put('/:id', servicePlanController.updateServicePlan);
router.delete('/:id', servicePlanController.deleteServicePlan);

module.exports = router;
