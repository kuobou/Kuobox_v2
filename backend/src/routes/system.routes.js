const router = require('express').Router();
const controller = require('../controllers/system.controller');

router.get('/status', controller.status);
router.get('/info', controller.info);
router.get('/ports', controller.ports);
router.get('/logs', controller.logs);

module.exports = router;
