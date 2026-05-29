const router = require('express').Router();
const ctrl = require('../controllers/repartidoresController');

router.get('/ubicaciones', ctrl.ubicaciones);
router.get('/', ctrl.listar);
router.post('/', ctrl.crear);
router.put('/:id/ubicacion', ctrl.actualizarUbicacion);
router.put('/:id', ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

module.exports = router;
