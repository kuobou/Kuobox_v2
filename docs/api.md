# RelayPanel API

All protected endpoints require `Authorization: Bearer <JWT>`.

## Auth

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## System

- `GET /api/system/status`
- `GET /api/system/info`
- `GET /api/system/ports`
- `GET /api/system/logs?service=realm&lines=100`

## Nodes

- `GET /api/nodes`
- `POST /api/nodes`
- `GET /api/nodes/:id`
- `PUT /api/nodes/:id`
- `DELETE /api/nodes/:id`

## Protocols

- `GET /api/protocols`
- `POST /api/protocols/vless-reality`
- `POST /api/protocols/vless-tcp`
- `POST /api/protocols/trojan`
- `POST /api/protocols/shadowsocks`
- `PUT /api/protocols/:id`
- `DELETE /api/protocols/:id`

## Relay

- `GET /api/relays`
- `POST /api/relays/realm`
- `POST /api/relays/gost`
- `PUT /api/relays/:id`
- `DELETE /api/relays/:id`

## Service

- `POST /api/service/:name/start`
- `POST /api/service/:name/stop`
- `POST /api/service/:name/restart`
- `GET /api/service/:name/status`

Allowed service names are `relay-panel`, `xray`, `sing-box`, `realm`, and `gost`.
