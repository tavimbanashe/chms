const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

// Budget Allocation Routes
router.get('/', budgetController.getAllBudgets);
router.get('/summary', budgetController.getBudgetSummary);
router.post('/', budgetController.createBudget);
router.put('/:id', budgetController.updateBudget);
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;
