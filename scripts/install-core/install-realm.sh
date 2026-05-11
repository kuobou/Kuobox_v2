#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Please run as root"
  exit 1
fi

arch="$(uname -m)"
case "$arch" in
  x86_64) asset="x86_64-unknown-linux-gnu" ;;
  aarch64) asset="aarch64-unknown-linux-gnu" ;;
  *) echo "Unsupported arch: $arch"; exit 1 ;;
esac

version="$(curl -fsSL https://api.github.com/repos/zhboner/realm/releases/latest | grep tag_name | cut -d '"' -f 4)"
curl -fsSL "https://github.com/zhboner/realm/releases/download/${version}/realm-${asset}.tar.gz" -o /tmp/realm.tar.gz
tar -xzf /tmp/realm.tar.gz -C /tmp
install -m 755 /tmp/realm /usr/local/bin/realm
mkdir -p /etc/realm
cp "$(dirname "$0")/../systemd/realm.service" /etc/systemd/system/realm.service
systemctl daemon-reload
systemctl enable realm
echo "Realm installed"
