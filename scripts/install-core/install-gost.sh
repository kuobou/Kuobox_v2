#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Please run as root"
  exit 1
fi

arch="$(uname -m)"
case "$arch" in
  x86_64) asset_suffix="linux_amd64" ;;
  aarch64) asset_suffix="linux_arm64" ;;
  *) echo "Unsupported arch: $arch"; exit 1 ;;
esac

# 從 GitHub Releases 取得對應平台的 tar.gz 下載連結（避開 go-gost upstream install.sh 不穩的問題）
asset_url="$(curl -fsSL https://api.github.com/repos/go-gost/gost/releases/latest \
  | grep '"browser_download_url"' \
  | grep "${asset_suffix}\.tar\.gz" \
  | head -1 \
  | cut -d '"' -f 4)"

if [[ -z "${asset_url}" ]]; then
  echo "ERROR: could not find gost release asset for ${asset_suffix}"
  exit 1
fi

echo "Downloading gost from ${asset_url}"
curl -fsSL "${asset_url}" -o /tmp/gost.tar.gz
rm -f /tmp/gost
tar -xzf /tmp/gost.tar.gz -C /tmp
install -m 755 /tmp/gost /usr/local/bin/gost

mkdir -p /etc/gost
cp "$(dirname "$0")/../systemd/gost.service" /etc/systemd/system/gost.service
systemctl daemon-reload
systemctl enable gost
echo "Gost installed: $(/usr/local/bin/gost -V 2>&1 | head -1 || true)"
