const express = require('express');
const router = express.Router();
const { getRegistrations, createRegistration, deleteRegistration } = require('../controllers/registrationsController');

router.get('/', getRegistrations);
router.post('/', createRegistration);
router.delete('/:id', deleteRegistration);

module.exports = router;
