const router = require('express').Router();
const controller = require('../controllers/relay.controller');

router.get('/', controller.list);
router.post('/realm', (req, res, next) => controller.createRelay('realm', req, res, next));
router.post('/gost', (req, res, next) => controller.createRelay('gost', req, res, next));
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
