const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// --- Member CRUD ---
router.get('/', memberController.getAllMembers);

router.post('/', memberController.createMember);
router.put('/:id', memberController.updateMember);
router.delete('/:id', memberController.deleteMember);

// --- Dropdown Data ---
router.get('/dropdowns', memberController.getDropdownData);

// --- First Timers ---
router.get('/first-timers', memberController.getFirstTimers);
router.post('/first-timers', memberController.addFirstTimer); 


router.put('/first-timers/:id', memberController.updateFirstTimer);

// --- New Converts ---
router.get('/new-converts', memberController.getNewConverts);
router.post('/new-converts', memberController.addNewConvert);

router.put('/new-converts/:id', memberController.updateNewConvert);

router.get('/:id', memberController.getMemberById);
module.exports = router;
