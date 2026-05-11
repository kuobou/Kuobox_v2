const { getDb } = require('../database/db');

function findByUsername(username) {
  return getDb().prepare('SELECT * FROM users WHERE username = ?').get(username);
}

function findById(id) {
  return getDb().prepare('SELECT id, username, role, created_at FROM users WHERE id = ?').get(id);
}

module.exports = { findByUsername, findById };
