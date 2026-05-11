const { getDb } = require('../database/db');

const fields = ['name', 'mode', 'ip', 'location', 'status'];

function all() {
  return getDb().prepare('SELECT * FROM nodes ORDER BY id DESC').all();
}

function find(id) {
  return getDb().prepare('SELECT * FROM nodes WHERE id = ?').get(id);
}

function create(data) {
  const info = getDb().prepare(
    'INSERT INTO nodes (name, mode, ip, location, status) VALUES (?, ?, ?, ?, ?)'
  ).run(data.name, data.mode, data.ip || '', data.location || '', data.status || 'unknown');
  return find(info.lastInsertRowid);
}

function update(id, data) {
  const current = find(id);
  if (!current) return null;
  const next = { ...current, ...data };
  getDb().prepare(
    'UPDATE nodes SET name = ?, mode = ?, ip = ?, location = ?, status = ? WHERE id = ?'
  ).run(next.name, next.mode, next.ip || '', next.location || '', next.status || 'unknown', id);
  return find(id);
}

function remove(id) {
  return getDb().prepare('DELETE FROM nodes WHERE id = ?').run(id).changes > 0;
}

module.exports = { all, find, create, update, remove, fields };
