const router  = require('express').Router();
const ctrl    = require('../controllers/productosController');

router.get('/',    ctrl.listar);
router.post('/',   ctrl.crear);
router.get('/:id', ctrl.obtener);
router.put('/:id', ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

module.exports = router;
