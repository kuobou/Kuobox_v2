#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
if [[ $# -lt 1 ]]; then
  echo "Usage: scripts/reset-password.sh <new-password>"
  exit 1
fi

node -e "const bcrypt=require('bcryptjs'); const {getDb,initDatabase}=require('./backend/src/database/db'); initDatabase(); getDb().prepare('UPDATE users SET password_hash=? WHERE username=?').run(bcrypt.hashSync(process.argv[1],10), process.env.DEFAULT_ADMIN || 'admin');" "$1"
echo "Password updated"
