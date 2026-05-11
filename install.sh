#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Please run as root: sudo bash install.sh"
  exit 1
fi

INSTALL_DIR="/opt/relay-panel"
PANEL_PORT="${PANEL_PORT:-3000}"
DEFAULT_ADMIN="${DEFAULT_ADMIN:-admin}"
DEFAULT_PASSWORD="${DEFAULT_PASSWORD:-changeme123}"

apt-get update -y
apt-get install -y curl ca-certificates build-essential python3

if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

mkdir -p "${INSTALL_DIR}"
cp -a . "${INSTALL_DIR}/"
cd "${INSTALL_DIR}"

npm install --omit=dev

cp backend/.env.example backend/.env
sed -i "s/^PANEL_PORT=.*/PANEL_PORT=${PANEL_PORT}/" backend/.env
sed -i "s/^DEFAULT_ADMIN=.*/DEFAULT_ADMIN=${DEFAULT_ADMIN}/" backend/.env
sed -i "s/^DEFAULT_PASSWORD=.*/DEFAULT_PASSWORD=${DEFAULT_PASSWORD}/" backend/.env
sed -i "s/^JWT_SECRET=.*/JWT_SECRET=$(openssl rand -hex 32)/" backend/.env

cp scripts/systemd/relay-panel.service /etc/systemd/system/relay-panel.service
systemctl daemon-reload
systemctl enable relay-panel
systemctl restart relay-panel

echo "RelayPanel installed: http://$(hostname -I | awk '{print $1}'):${PANEL_PORT}"
echo "Username: ${DEFAULT_ADMIN}"
echo "Password: ${DEFAULT_PASSWORD}"
