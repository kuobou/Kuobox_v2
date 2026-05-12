const inboundModel = require('../models/inbound.model');
const generator = require('../services/configGenerator.service');
const xray = require('../services/xray.service');
const { buildShareLink } = require('../services/shareLink.service');
const serviceController = require('./service.controller');
const { assertPort, isPortAvailable } = require('../utils/port');
const { uuid } = require('../utils/uuid');
const { hex } = require('../utils/random');

async function createProtocol(protocol, req, res, next) {
  try {
    const port = assertPort(req.body.port);
    if (!(await isPortAvailable(port))) {
      return res.status(409).json({ error: `Port ${port} is already in use` });
    }

    const vars = {
      ...req.body,
      protocol,
      port,
      uuid: req.body.uuid || uuid(),
      flow: req.body.flow || 'xtls-rprx-vision',
      short_id: req.body.short_id || hex(4),
      server_name: req.body.server_name || 'www.microsoft.com',
      fingerprint: req.body.fingerprint || 'chrome',
      dest: req.body.dest || 'www.microsoft.com:443',
      reality_private_key: req.body.privateKey || req.body.reality_private_key || '',
      reality_public_key: req.body.publicKey || req.body.reality_public_key || '',
      password: req.body.password || hex(16),
      method: req.body.method || '2022-blake3-aes-128-gcm'
    };

    const generated = generator.generateInbound(protocol, vars);
    const share_link = buildShareLink(protocol, vars);
    const inbound = inboundModel.create({
      ...vars,
      node_id: req.body.node_id,
      config_path: generated.outputPath,
      share_link
    });

    if (req.body.apply === true) {
      xray.syncConfig(generated.outputPath);
      await serviceController.runServiceAction('restart', 'xray');
    }
    res.status(201).json({ inbound: { ...inbound, share_link }, config: generated.content, share_link });
  } catch (error) {
    next(error);
  }
}

function list(req, res) {
  res.json({ protocols: inboundModel.all() });
}

function update(req, res) {
  const inbound = inboundModel.update(req.params.id, req.body);
  if (!inbound) return res.status(404).json({ error: 'Protocol not found' });
  res.json({ inbound });
}

function remove(req, res) {
  res.json({ ok: inboundModel.remove(req.params.id) });
}

module.exports = { list, createProtocol, update, remove };
