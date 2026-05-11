const systemService = require('../services/system.service');
const trafficService = require('../services/traffic.service');
const serviceController = require('./service.controller');
const { journal } = require('../utils/shell');

async function status(req, res, next) {
  try {
    const services = await serviceController.collectStatuses();
    const traffic = trafficService.readProcNetDev();
    res.json({ services, traffic });
  } catch (error) {
    next(error);
  }
}

async function info(req, res, next) {
  try {
    res.json(await systemService.info());
  } catch (error) {
    next(error);
  }
}

async function ports(req, res, next) {
  try {
    res.json(await systemService.ports());
  } catch (error) {
    next(error);
  }
}

async function logs(req, res, next) {
  try {
    const result = await journal(req.query.service || 'relay-panel', req.query.lines || 100);
    res.json({ logs: result.stdout, error: result.stderr });
  } catch (error) {
    next(error);
  }
}

module.exports = { status, info, ports, logs };
