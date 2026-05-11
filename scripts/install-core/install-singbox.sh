#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Please run as root"
  exit 1
fi

bash <(curl -fsSL https://sing-box.app/deb-install.sh)
mkdir -p /etc/sing-box
systemctl enable sing-box
echo "sing-box installed"
