const express = require('express');
const router = express.Router();
const serviceAgendaController = require('../controllers/serviceAgendaController');

// Service Agenda Routes
router.get('/', serviceAgendaController.getAllAgendas);
router.post('/', serviceAgendaController.createAgenda);
router.put('/:id', serviceAgendaController.updateAgenda);
router.delete('/:id', serviceAgendaController.deleteAgenda);

module.exports = router;
