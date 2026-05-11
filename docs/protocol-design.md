# Protocol Design

Controllers do not hard-code protocol templates. They validate request data and call `configGenerator.service.js`.

Generation flow:

1. Validate port and payload.
2. Check port availability.
3. Select template from `templates/`.
4. Render variables.
5. Write output under `storage/configs/`.
6. Create or update SQLite records.
7. If `apply: true`, copy to the service path and restart with `systemctl`.

Supported landing protocols:

- Xray VLESS + REALITY
- Xray VLESS TCP
- Xray Trojan TLS
- Xray Shadowsocks

Supported relay engines:

- Realm TCP/UDP
- Gost TCP/UDP
