#!/usr/bin/env bash
set -euo pipefail

cd /opt/relay-panel
cd frontend
npm install
npm run build
rm -rf node_modules package-lock.json
cd ../backend
npm install --omit=dev || {
  apt-get install -y build-essential python3
  npm install --omit=dev
}
systemctl restart relay-panel
echo "RelayPanel updated"
