const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const { authRequired } = require('../middleware/auth.middleware');

router.post('/login', controller.login);
router.post('/logout', authRequired, controller.logout);
router.get('/me', authRequired, controller.me);

module.exports = router;
