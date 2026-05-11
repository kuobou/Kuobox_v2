const os = require('os');
const { runFile } = require('../utils/shell');

async function info() {
  const disk = await runFile('/bin/df', ['-h', '/']);
  return {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    uptime: os.uptime(),
    loadavg: os.loadavg(),
    memory: {
      total: os.totalmem(),
      free: os.freemem()
    },
    disk: disk.stdout
  };
}

async function ports() {
  const ss = await runFile('/usr/bin/ss', ['-tuln']);
  return { raw: ss.stdout };
}

module.exports = { info, ports };
