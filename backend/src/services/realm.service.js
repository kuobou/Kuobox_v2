const fs = require('fs');
const path = require('path');
const { backupFile } = require('./configGenerator.service');

const targetPath = () => process.env.REALM_CONFIG_PATH || '/etc/realm/config.toml';

function syncConfig(localConfigPath) {
  const target = targetPath();
  fs.mkdirSync(path.dirname(target), { recursive: true });
  backupFile(target);
  fs.copyFileSync(localConfigPath, target);
}

module.exports = { syncConfig };
