const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');

router.post('/consultas', consultaController.crearConsulta);
router.get('/consultas', consultaController.obtenerConsultas);

module.exports = router;