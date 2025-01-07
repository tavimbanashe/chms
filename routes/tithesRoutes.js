const express = require('express');
const router = express.Router();
const tithesController = require('../controllers/tithesController');

router.get('/', tithesController.getAllTithes);
router.post('/', tithesController.createTithe);
router.delete('/:id', tithesController.deleteTithe);

module.exports = router;
