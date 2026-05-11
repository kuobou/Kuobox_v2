const fs = require('fs');
const path = require('path');
const { configRoot, backupRoot, fromRoot } = require('../utils/paths');

const PROTOCOLS = new Set(['vless-reality', 'vless-tcp', 'trojan', 'shadowsocks']);
const RELAYS = new Set(['realm', 'gost']);

function readTemplate(...parts) {
  return fs.readFileSync(fromRoot('templates', ...parts), 'utf8');
}

function renderString(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = vars[key];
    return value === undefined || value === null ? '' : String(value);
  });
}

function backupFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const target = path.join(backupRoot(), `${path.basename(filePath)}.${stamp}.bak`);
  fs.copyFileSync(filePath, target);
  return target;
}

function writeConfig(relativeDir, fileName, content) {
  const dir = path.join(configRoot(), relativeDir);
  fs.mkdirSync(dir, { recursive: true });
  const output = path.join(dir, fileName);
  backupFile(output);
  fs.writeFileSync(output, content);
  return output;
}

function generateInbound(protocol, vars) {
  if (!PROTOCOLS.has(protocol)) {
    const err = new Error(`Unsupported protocol: ${protocol}`);
    err.status = 400;
    throw err;
  }
  const templateMap = {
    'vless-reality': ['xray', 'vless-reality.json'],
    'vless-tcp': ['xray', 'vless-tcp.json'],
    trojan: ['xray', 'trojan-tls.json'],
    shadowsocks: ['xray', 'shadowsocks.json']
  };
  const content = renderString(readTemplate(...templateMap[protocol]), vars);
  const outputPath = writeConfig('xray', `${protocol}-${vars.port}.json`, content);
  return { content, outputPath };
}

function generateRelay(type, vars) {
  if (!RELAYS.has(type)) {
    const err = new Error(`Unsupported relay type: ${type}`);
    err.status = 400;
    throw err;
  }
  const templateMap = {
    realm: ['realm', 'realm.toml'],
    gost: ['gost', 'gost.yaml']
  };
  const ext = type === 'realm' ? 'toml' : 'yaml';
  const content = renderString(readTemplate(...templateMap[type]), vars);
  const outputPath = writeConfig(type, `${type}-${vars.listen_port}.${ext}`, content);
  return { content, outputPath };
}

module.exports = { generateInbound, generateRelay, backupFile };
