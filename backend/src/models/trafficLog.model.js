const { getDb } = require('../database/db');

function latest(limit = 100) {
  return getDb().prepare('SELECT * FROM traffic_logs ORDER BY recorded_at DESC LIMIT ?').all(limit);
}

module.exports = { latest };
