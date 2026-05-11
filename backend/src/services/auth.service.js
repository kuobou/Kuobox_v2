const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

function login(username, password) {
  const user = userModel.findByUsername(username);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    const err = new Error('Invalid username or password');
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '12h' }
  );

  return { token, user: { id: user.id, username: user.username, role: user.role } };
}

module.exports = { login };
