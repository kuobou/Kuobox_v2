const router = require('express').Router();
const controller = require('../controllers/service.controller');

router.post('/:name/start', (req, res, next) => controller.act({ ...req, params: { ...req.params, action: 'start' } }, res, next));
router.post('/:name/stop', (req, res, next) => controller.act({ ...req, params: { ...req.params, action: 'stop' } }, res, next));
router.post('/:name/restart', (req, res, next) => controller.act({ ...req, params: { ...req.params, action: 'restart' } }, res, next));
router.get('/:name/status', (req, res, next) => controller.act({ ...req, params: { ...req.params, action: 'is-active' } }, res, next));

module.exports = router;
