const { getDb } = require('../database/db');

function all() {
  return getDb().prepare('SELECT * FROM inbounds ORDER BY id DESC').all();
}

function find(id) {
  return getDb().prepare('SELECT * FROM inbounds WHERE id = ?').get(id);
}

function create(data) {
  const info = getDb().prepare(`
    INSERT INTO inbounds (
      node_id, protocol, port, uuid, flow, reality_private_key, reality_public_key,
      short_id, server_name, fingerprint, dest, config_path, share_link, enabled
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    data.node_id || null,
    data.protocol,
    data.port,
    data.uuid || null,
    data.flow || null,
    data.reality_private_key || null,
    data.reality_public_key || null,
    data.short_id || null,
    data.server_name || null,
    data.fingerprint || null,
    data.dest || null,
    data.config_path || null,
    data.share_link || null,
    data.enabled === false ? 0 : 1
  );
  return find(info.lastInsertRowid);
}

function update(id, data) {
  const current = find(id);
  if (!current) return null;
  const next = { ...current, ...data };
  getDb().prepare(`
    UPDATE inbounds SET node_id = ?, protocol = ?, port = ?, uuid = ?, flow = ?,
      reality_private_key = ?, reality_public_key = ?, short_id = ?, server_name = ?,
      fingerprint = ?, dest = ?, config_path = ?, share_link = ?, enabled = ? WHERE id = ?
  `).run(
    next.node_id || null,
    next.protocol,
    next.port,
    next.uuid || null,
    next.flow || null,
    next.reality_private_key || null,
    next.reality_public_key || null,
    next.short_id || null,
    next.server_name || null,
    next.fingerprint || null,
    next.dest || null,
    next.config_path || null,
    next.share_link || null,
    next.enabled ? 1 : 0,
    id
  );
  return find(id);
}

function remove(id) {
  return getDb().prepare('DELETE FROM inbounds WHERE id = ?').run(id).changes > 0;
}

module.exports = { all, find, create, update, remove };
