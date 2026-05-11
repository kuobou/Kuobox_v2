# Database

SQLite database path defaults to `storage/db/relay-panel.sqlite`.

Tables:

- `users`
- `nodes`
- `inbounds`
- `relay_rules`
- `traffic_logs`
- `settings`

The schema lives in `backend/src/database/schema.sql` and is applied on backend startup.
