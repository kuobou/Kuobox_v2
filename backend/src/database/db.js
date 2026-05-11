const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');

let db;

function resolveFromBackend(value, fallback) {
  return path.resolve(__dirname, '..', '..', value || fallback);
}

function getDbPath() {
  return resolveFromBackend(process.env.DB_PATH, '../storage/db/relay-panel.sqlite');
}

function getDb() {
  if (!db) {
    const dbPath = getDbPath();
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    db = new Database(dbPath);
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initDatabase() {
  const database = getDb();
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  database.exec(schema);

  const count = database.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  if (count === 0) {
    const username = process.env.DEFAULT_ADMIN || 'admin';
    const password = process.env.DEFAULT_PASSWORD || 'changeme123';
    const hash = bcrypt.hashSync(password, 10);
    database.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run(username, hash, 'admin');
  }
}

module.exports = { getDb, initDatabase, getDbPath };
