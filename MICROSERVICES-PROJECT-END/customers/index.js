const express = require('express');
const { PORT, requireVars } = require('./src/config');
const databaseConnection = require('./src/database/connection');
const expressApp = require('./src/express-app');

const StartServer = async () => {
  requireVars('DB_URL');
  const app = express();
  await databaseConnection();
  await expressApp(app);
  app.get('/health', (req, res) => res.json({ service: 'customers', status: 'ok' }));
  app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
};

StartServer();