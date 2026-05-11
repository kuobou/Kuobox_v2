#!/usr/bin/env bash
set -euo pipefail

cd /opt/relay-panel
npm install --omit=dev
systemctl restart relay-panel
echo "RelayPanel updated"
