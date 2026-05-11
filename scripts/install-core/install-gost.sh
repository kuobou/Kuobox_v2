#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Please run as root"
  exit 1
fi

bash -c "$(curl -fsSL https://github.com/go-gost/gost/raw/master/install.sh)"
mkdir -p /etc/gost
cp "$(dirname "$0")/../systemd/gost.service" /etc/systemd/system/gost.service
systemctl daemon-reload
systemctl enable gost
echo "Gost installed"
