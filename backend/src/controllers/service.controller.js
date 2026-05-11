const { systemctl } = require('../utils/shell');

async function runServiceAction(action, name) {
  return systemctl(action, name);
}

async function collectStatuses(names = ['xray', 'sing-box', 'realm', 'gost']) {
  const services = {};
  for (const name of names) {
    const result = await runServiceAction('is-active', name);
    services[name] = result.stdout || 'unknown';
  }
  return services;
}

async function act(req, res, next) {
  try {
    const result = await runServiceAction(req.params.action, req.params.name);
    res.status(result.ok ? 200 : 500).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = { act, runServiceAction, collectStatuses };
