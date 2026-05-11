const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..', '..');

function fromRoot(...parts) {
  return path.join(root, ...parts);
}

function configRoot() {
  return path.resolve(__dirname, '..', '..', process.env.CONFIG_ROOT || '../storage/configs');
}

function backupRoot() {
  return path.resolve(__dirname, '..', '..', process.env.BACKUP_ROOT || '../storage/backups');
}

function ensureStorage() {
  [
    configRoot(),
    backupRoot(),
    fromRoot('storage', 'db'),
    fromRoot('storage', 'logs'),
    fromRoot('storage', 'configs', 'xray'),
    fromRoot('storage', 'configs', 'singbox'),
    fromRoot('storage', 'configs', 'realm'),
    fromRoot('storage', 'configs', 'gost')
  ].forEach((dir) => fs.mkdirSync(dir, { recursive: true }));
}

module.exports = { root, fromRoot, configRoot, backupRoot, ensureStorage };
