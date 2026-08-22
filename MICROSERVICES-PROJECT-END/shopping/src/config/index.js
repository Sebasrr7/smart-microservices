require('dotenv').config({ quiet: true });
const config = { PORT: process.env.PORT || 8003, CUSTOMERS_URL: process.env.CUSTOMERS_URL, APP_SECRET: process.env.APP_SECRET };
config.requireVars = (...names) => { const missing = names.filter((name) => !config[name]); if (missing.length) { console.error(`Missing required env vars: ${missing.join(', ')}`); process.exit(1); } };
module.exports = config;
