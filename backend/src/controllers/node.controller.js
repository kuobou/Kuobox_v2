const nodeModel = require('../models/node.model');

const MODES = new Set(['landing', 'relay', 'hybrid']);

function normalize(data) {
  if (!data.name) {
    const err = new Error('Node name is required');
    err.status = 400;
    throw err;
  }
  if (!MODES.has(data.mode)) {
    const err = new Error('Node mode must be landing, relay, or hybrid');
    err.status = 400;
    throw err;
  }
  return data;
}

function list(req, res) {
  res.json({ nodes: nodeModel.all() });
}

function get(req, res) {
  const node = nodeModel.find(req.params.id);
  if (!node) return res.status(404).json({ error: 'Node not found' });
  res.json({ node });
}

function create(req, res, next) {
  try {
    res.status(201).json({ node: nodeModel.create(normalize(req.body)) });
  } catch (error) {
    next(error);
  }
}

function update(req, res, next) {
  try {
    const node = nodeModel.update(req.params.id, normalize(req.body));
    if (!node) return res.status(404).json({ error: 'Node not found' });
    res.json({ node });
  } catch (error) {
    next(error);
  }
}

function remove(req, res) {
  res.json({ ok: nodeModel.remove(req.params.id) });
}

module.exports = { list, get, create, update, remove };
