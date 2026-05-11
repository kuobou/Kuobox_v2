# RelayPanel

RelayPanel is a Web panel for managing landing protocols and relay forwarding rules.

## MVP Features

- JWT login/logout
- SQLite schema and bootstrap admin user
- Node modes: Landing, Relay, Hybrid
- Xray inbound config generation: VLESS + REALITY, VLESS TCP, Trojan, Shadowsocks
- Realm and Gost relay rule generation
- Centralized `systemctl` control with service-name whitelist
- Config output under `storage/configs/`
- Automatic backup before config overwrite
- Vue 3 + Vite dashboard and management forms

## One-click Install

Run this on Debian / Ubuntu as root:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/kuobou/Kuobox_v2/main/install.sh)
```

Custom install options:

```bash
PANEL_PORT=3000 DEFAULT_ADMIN=admin DEFAULT_PASSWORD='change-me' bash <(curl -fsSL https://raw.githubusercontent.com/kuobou/Kuobox_v2/main/install.sh)
```

After installation, open:

```text
http://your-server-ip:3000
```

## Development

```bash
npm install
npm run dev
npm run frontend:dev
```

Default backend: `http://127.0.0.1:3000`

Default frontend: `http://127.0.0.1:5173`

Initial login:

- Username: `admin`
- Password: `changeme123`

## Structure

The project follows the requested RelayPanel layout:

- `backend/`: Express, SQLite, JWT, services, controllers, routes
- `frontend/`: Vue 3, Vite, Pinia, Axios
- `templates/`: Xray, sing-box, Realm, Gost templates
- `scripts/`: installer, updater, uninstall, core installers, systemd units
- `storage/`: generated configs, logs, backups, SQLite data
- `docs/`: API, database, install, protocol design
