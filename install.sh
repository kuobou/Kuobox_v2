#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Please run as root: sudo bash install.sh"
  exit 1
fi

INSTALL_DIR="/opt/relay-panel"
REPO_ZIP_URL="${REPO_ZIP_URL:-https://github.com/kuobou/Kuobox_v2/archive/refs/heads/main.zip}"
TMP_DIR="/tmp/relay-panel-install"
PANEL_PORT="${PANEL_PORT:-3000}"
DEFAULT_ADMIN="${DEFAULT_ADMIN:-admin}"
DEFAULT_PASSWORD="${DEFAULT_PASSWORD:-changeme123}"

apt-get update -y
apt-get install -y curl ca-certificates build-essential python3 unzip openssl

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

rm -rf "${TMP_DIR}"
mkdir -p "${TMP_DIR}"

if [[ -f "./package.json" && -d "./backend" && -d "./frontend" ]]; then
  SOURCE_DIR="$(pwd)"
else
  curl -fsSL "${REPO_ZIP_URL}" -o "${TMP_DIR}/relay-panel.zip"
  unzip -q "${TMP_DIR}/relay-panel.zip" -d "${TMP_DIR}"
  SOURCE_DIR="$(find "${TMP_DIR}" -maxdepth 1 -type d -name 'Kuobox_v2-*' | head -n 1)"
fi

if [[ -z "${SOURCE_DIR:-}" || ! -f "${SOURCE_DIR}/package.json" ]]; then
  echo "Install source is invalid: package.json not found"
  exit 1
fi

mkdir -p "${INSTALL_DIR}"
cp -a "${SOURCE_DIR}/." "${INSTALL_DIR}/"
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

PUBLIC_IP="$(curl -4 -fsSL --max-time 5 https://api.ipify.org 2>/dev/null || curl -4 -fsSL --max-time 5 https://ifconfig.me 2>/dev/null || true)"
LOCAL_IP="$(hostname -I | awk '{print $1}')"

if [[ -n "${PUBLIC_IP}" ]]; then
  echo "RelayPanel public URL: http://${PUBLIC_IP}:${PANEL_PORT}"
fi
echo "RelayPanel local URL: http://${LOCAL_IP}:${PANEL_PORT}"
echo "Username: ${DEFAULT_ADMIN}"
echo "Password: ${DEFAULT_PASSWORD}"
