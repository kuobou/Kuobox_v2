const net = require('net');

function assertPort(port) {
  const value = Number(port);
  if (!Number.isInteger(value) || value < 1 || value > 65535) {
    const err = new Error('Port must be an integer between 1 and 65535');
    err.status = 400;
    throw err;
  }
  return value;
}

function isPortAvailable(port, host = '0.0.0.0') {
  const value = assertPort(port);
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => server.close(() => resolve(true)));
    server.listen(value, host);
  });
}

module.exports = { assertPort, isPortAvailable };
