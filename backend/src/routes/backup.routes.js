const router = require('express').Router();
const controller = require('../controllers/backup.controller');

router.post('/create', controller.create);
router.post('/restore', controller.restore);
router.get('/list', controller.list);

module.exports = router;
