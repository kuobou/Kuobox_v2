#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Please run as root"
  exit 1
fi

systemctl stop relay-panel 2>/dev/null || true
systemctl disable relay-panel 2>/dev/null || true
rm -f /etc/systemd/system/relay-panel.service
systemctl daemon-reload
echo "RelayPanel service removed. Delete /opt/relay-panel manually if you also want to remove data."
