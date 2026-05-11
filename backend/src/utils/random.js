const crypto = require('crypto');

function hex(bytes = 4) {
  return crypto.randomBytes(bytes).toString('hex');
}

function token(bytes = 32) {
  return crypto.randomBytes(bytes).toString('base64url');
}

module.exports = { hex, token };
