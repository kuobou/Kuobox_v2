const router = require('express').Router();
const controller = require('../controllers/system.controller');

router.get('/', controller.logs);

module.exports = router;
