const { getDb } = require('../database/db');

function all() {
  return getDb().prepare('SELECT * FROM relay_rules ORDER BY id DESC').all();
}

function find(id) {
  return getDb().prepare('SELECT * FROM relay_rules WHERE id = ?').get(id);
}

function create(data) {
  const info = getDb().prepare(`
    INSERT INTO relay_rules (
      node_id, relay_type, listen_port, remote_host, remote_port, protocol, config_path, enabled
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    data.node_id || null,
    data.relay_type,
    data.listen_port,
    data.remote_host,
    data.remote_port,
    data.protocol || 'tcp',
    data.config_path || null,
    data.enabled === false ? 0 : 1
  );
  return find(info.lastInsertRowid);
}

function update(id, data) {
  const current = find(id);
  if (!current) return null;
  const next = { ...current, ...data };
  getDb().prepare(`
    UPDATE relay_rules SET node_id = ?, relay_type = ?, listen_port = ?, remote_host = ?,
      remote_port = ?, protocol = ?, config_path = ?, enabled = ? WHERE id = ?
  `).run(
    next.node_id || null,
    next.relay_type,
    next.listen_port,
    next.remote_host,
    next.remote_port,
    next.protocol || 'tcp',
    next.config_path || null,
    next.enabled ? 1 : 0,
    id
  );
  return find(id);
}

function remove(id) {
  return getDb().prepare('DELETE FROM relay_rules WHERE id = ?').run(id).changes > 0;
}

module.exports = { all, find, create, update, remove };
