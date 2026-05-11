const authService = require('../services/auth.service');
const userModel = require('../models/user.model');

function login(req, res, next) {
  try {
    const { username = 'admin', password } = req.body || {};
    res.json(authService.login(username, password));
  } catch (error) {
    next(error);
  }
}

function logout(req, res) {
  res.json({ ok: true });
}

function me(req, res) {
  res.json({ user: userModel.findById(req.user.id) });
}

module.exports = { login, logout, me };
