require('dotenv').config();

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const nodeRoutes = require('./routes/node.routes');
const protocolRoutes = require('./routes/protocol.routes');
const relayRoutes = require('./routes/relay.routes');
const serviceRoutes = require('./routes/service.routes');
const systemRoutes = require('./routes/system.routes');
const logRoutes = require('./routes/log.routes');
const backupRoutes = require('./routes/backup.routes');
const { authRequired } = require('./middleware/auth.middleware');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => res.json({ ok: true, name: 'RelayPanel' }));
app.use('/api/auth', authRoutes);
app.use('/api/system', authRequired, systemRoutes);
app.use('/api/logs', authRequired, logRoutes);
app.use('/api/nodes', authRequired, nodeRoutes);
app.use('/api/protocols', authRequired, protocolRoutes);
app.use('/api/relays', authRequired, relayRoutes);
app.use('/api/service', authRequired, serviceRoutes);
app.use('/api/backup', authRequired, backupRoutes);

const frontendDist = path.resolve(__dirname, '..', '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
