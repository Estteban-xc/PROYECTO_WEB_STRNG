const router = require('express').Router();
const ctrl   = require('../controllers/paquetesController');

// Públicas
router.get('/estadisticas',  ctrl.estadisticas);
router.get('/:guia',         ctrl.obtenerPaquete);

// Admin
router.get('/',              ctrl.listarPaquetes);
router.post('/',             ctrl.crearPaquete);
router.put('/:id',           ctrl.actualizarPaquete);
router.delete('/:id',        ctrl.eliminarPaquete);

module.exports = router;
