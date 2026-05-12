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
# 預設安裝的代理核心。可用環境變數覆蓋，例如：INSTALL_CORES="realm xray"
INSTALL_CORES="${INSTALL_CORES:-realm xray gost singbox}"

apt-get update -y
apt-get install -y curl ca-certificates build-essential python3 openssl unzip

if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

# 若當前目錄不是專案根目錄，就從 GitHub 下載 zip
if [[ -f "./package.json" && -d "./backend" && -d "./frontend" ]]; then
  SOURCE_DIR="$(pwd)"
else
  rm -rf "${TMP_DIR}"
  mkdir -p "${TMP_DIR}"
  echo "Downloading source from ${REPO_ZIP_URL}"
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

# 安裝所有 workspace 依賴（含 frontend 的 vite，用於下一步 build）
npm install

# 編譯前端到 frontend/dist，由 backend 直接 serve
npm run build

# 安裝完前端編譯所需 dev 套件後，再瘦身只留執行期依賴
rm -rf frontend/node_modules
npm prune --omit=dev

cp backend/.env.example backend/.env
sed -i "s/^PANEL_PORT=.*/PANEL_PORT=${PANEL_PORT}/" backend/.env
sed -i "s/^DEFAULT_ADMIN=.*/DEFAULT_ADMIN=${DEFAULT_ADMIN}/" backend/.env
sed -i "s/^DEFAULT_PASSWORD=.*/DEFAULT_PASSWORD=${DEFAULT_PASSWORD}/" backend/.env
sed -i "s/^JWT_SECRET=.*/JWT_SECRET=$(openssl rand -hex 32)/" backend/.env

cp scripts/systemd/relay-panel.service /etc/systemd/system/relay-panel.service
systemctl daemon-reload
systemctl enable relay-panel
systemctl restart relay-panel

# 安裝代理核心（realm / xray / gost / sing-box）
# 失敗不中斷整個安裝，僅輸出警告——使用者可之後手動補裝
for core in ${INSTALL_CORES}; do
  script="${INSTALL_DIR}/scripts/install-core/install-${core}.sh"
  if [[ ! -f "${script}" ]]; then
    echo "WARN: unknown core '${core}', skipped"
    continue
  fi
  echo ">>> Installing core: ${core}"
  if ! bash "${script}"; then
    echo "WARN: failed to install ${core} — 你之後可手動執行 ${script}"
  fi
done
systemctl daemon-reload || true

PUBLIC_IP="$(curl -4 -fsSL --max-time 5 https://api.ipify.org 2>/dev/null || curl -4 -fsSL --max-time 5 https://ifconfig.me 2>/dev/null || true)"
LOCAL_IP="$(hostname -I | awk '{print $1}')"

if [[ -n "${PUBLIC_IP}" ]]; then
  echo "RelayPanel public URL: http://${PUBLIC_IP}:${PANEL_PORT}"
fi
echo "RelayPanel local URL:  http://${LOCAL_IP}:${PANEL_PORT}"
echo "Username: ${DEFAULT_ADMIN}"
echo "Password: ${DEFAULT_PASSWORD}"
