const { execFile } = require('child_process');

const SERVICE_NAMES = new Set(['relay-panel', 'xray', 'sing-box', 'realm', 'gost']);
const SERVICE_ACTIONS = new Set(['start', 'stop', 'restart', 'is-active', 'status']);

function runFile(file, args = [], options = {}) {
  return new Promise((resolve) => {
    execFile(file, args, { timeout: options.timeout || 15000 }, (error, stdout, stderr) => {
      resolve({
        ok: !error,
        code: error?.code || 0,
        stdout: String(stdout || '').trim(),
        stderr: String(stderr || error?.message || '').trim()
      });
    });
  });
}

function assertServiceName(name) {
  if (!SERVICE_NAMES.has(name)) {
    const allowed = [...SERVICE_NAMES].join(', ');
    const err = new Error(`Unsupported service "${name}". Allowed: ${allowed}`);
    err.status = 400;
    throw err;
  }
}

function assertServiceAction(action) {
  if (!SERVICE_ACTIONS.has(action)) {
    const err = new Error(`Unsupported systemctl action "${action}"`);
    err.status = 400;
    throw err;
  }
}

async function systemctl(action, name) {
  assertServiceAction(action);
  assertServiceName(name);
  return runFile('/usr/bin/systemctl', [action, name], { timeout: 20000 });
}

async function journal(service, lines = 100) {
  assertServiceName(service);
  const safeLines = Math.min(Math.max(Number(lines) || 100, 1), 1000);
  return runFile('/usr/bin/journalctl', ['-u', service, '-n', String(safeLines), '--no-pager', '--output=cat']);
}

module.exports = { runFile, systemctl, journal, assertServiceName };
