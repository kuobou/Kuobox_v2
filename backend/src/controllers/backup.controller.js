const fs = require('fs');
const path = require('path');
const { backupRoot, configRoot } = require('../utils/paths');

function list(req, res) {
  const backups = fs.readdirSync(backupRoot()).sort().reverse();
  res.json({ backups });
}

function create(req, res) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const target = path.join(backupRoot(), `configs-${stamp}`);
  fs.cpSync(configRoot(), target, { recursive: true });
  res.status(201).json({ ok: true, backup: path.basename(target) });
}

function restore(req, res) {
  const name = path.basename(req.body.name || '');
  if (!name) return res.status(400).json({ error: 'Backup name is required' });
  const source = path.join(backupRoot(), name);
  if (!fs.existsSync(source)) return res.status(404).json({ error: 'Backup not found' });
  fs.cpSync(source, configRoot(), { recursive: true });
  res.json({ ok: true });
}

module.exports = { list, create, restore };
