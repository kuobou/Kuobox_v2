const fs = require('fs');

function readProcNetDev() {
  const raw = fs.readFileSync('/proc/net/dev', 'utf8');
  let upload = 0;
  let download = 0;
  for (const line of raw.split('\n').slice(2)) {
    const cleaned = line.trim();
    if (!cleaned || cleaned.startsWith('lo:')) continue;
    const [iface, rest] = cleaned.split(':');
    if (!iface || !rest) continue;
    const parts = rest.trim().split(/\s+/).map(Number);
    download += parts[0] || 0;
    upload += parts[8] || 0;
  }
  return { upload, download };
}

module.exports = { readProcNetDev };
