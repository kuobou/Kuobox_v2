const app = require('./app');
const { initDatabase } = require('./database/db');
const { ensureStorage } = require('./utils/paths');

const host = process.env.PANEL_HOST || '0.0.0.0';
const port = Number(process.env.PANEL_PORT || 3000);

ensureStorage();
initDatabase();

app.listen(port, host, () => {
  console.log(`RelayPanel backend listening on http://${host}:${port}`);
});
