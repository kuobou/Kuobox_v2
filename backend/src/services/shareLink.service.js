function encodeName(value) {
  return encodeURIComponent(value || 'RelayPanel');
}

function query(params) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
}

function base64Url(value) {
  return Buffer.from(value).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function buildShareLink(protocol, data) {
  const host = data.server_host || data.public_host || data.host || data.ip || '';
  if (!host) return '';

  const name = encodeName(data.name || `${protocol}-${data.port}`);
  if (protocol === 'vless-reality') {
    const params = query({
      encryption: 'none',
      flow: data.flow,
      security: 'reality',
      sni: data.server_name,
      fp: data.fingerprint,
      pbk: data.reality_public_key,
      sid: data.short_id,
      type: 'tcp',
      headerType: 'none'
    });
    return `vless://${data.uuid}@${host}:${data.port}?${params}#${name}`;
  }

  if (protocol === 'vless-tcp') {
    const params = query({
      encryption: 'none',
      security: 'none',
      type: 'tcp',
      headerType: 'none'
    });
    return `vless://${data.uuid}@${host}:${data.port}?${params}#${name}`;
  }

  if (protocol === 'trojan') {
    const params = query({
      security: 'tls',
      sni: data.server_name,
      type: 'tcp',
      headerType: 'none'
    });
    return `trojan://${data.password}@${host}:${data.port}?${params}#${name}`;
  }

  if (protocol === 'shadowsocks') {
    const userinfo = base64Url(`${data.method}:${data.password}`);
    return `ss://${userinfo}@${host}:${data.port}#${name}`;
  }

  return '';
}

module.exports = { buildShareLink };
