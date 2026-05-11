const router = require('express').Router();
const controller = require('../controllers/protocol.controller');

router.get('/', controller.list);
router.post('/vless-reality', (req, res, next) => controller.createProtocol('vless-reality', req, res, next));
router.post('/vless-tcp', (req, res, next) => controller.createProtocol('vless-tcp', req, res, next));
router.post('/trojan', (req, res, next) => controller.createProtocol('trojan', req, res, next));
router.post('/shadowsocks', (req, res, next) => controller.createProtocol('shadowsocks', req, res, next));
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
