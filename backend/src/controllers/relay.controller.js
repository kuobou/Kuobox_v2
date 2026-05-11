const relayModel = require('../models/relayRule.model');
const generator = require('../services/configGenerator.service');
const realm = require('../services/realm.service');
const serviceController = require('./service.controller');
const { assertPort, isPortAvailable } = require('../utils/port');

async function createRelay(type, req, res, next) {
  try {
    const listenPort = assertPort(req.body.listen_port);
    const remotePort = assertPort(req.body.remote_port);
    if (!(await isPortAvailable(listenPort))) {
      return res.status(409).json({ error: `Port ${listenPort} is already in use` });
    }
    if (!req.body.remote_host) return res.status(400).json({ error: 'remote_host is required' });

    const vars = {
      ...req.body,
      relay_type: type,
      listen_port: listenPort,
      remote_port: remotePort,
      protocol: req.body.protocol || 'tcp'
    };
    const generated = generator.generateRelay(type, vars);
    const rule = relayModel.create({ ...vars, config_path: generated.outputPath });

    if (req.body.apply === true && type === 'realm') {
      realm.syncConfig(generated.outputPath);
      await serviceController.runServiceAction('restart', 'realm');
    }
    if (req.body.apply === true && type === 'gost') {
      await serviceController.runServiceAction('restart', 'gost');
    }
    res.status(201).json({ relay: rule, config: generated.content });
  } catch (error) {
    next(error);
  }
}

function list(req, res) {
  res.json({ relays: relayModel.all() });
}

function update(req, res) {
  const relay = relayModel.update(req.params.id, req.body);
  if (!relay) return res.status(404).json({ error: 'Relay not found' });
  res.json({ relay });
}

function remove(req, res) {
  res.json({ ok: relayModel.remove(req.params.id) });
}

module.exports = { list, createRelay, update, remove };
