const express = require('express');
const { PORT, requireVars } = require('./src/config');
const expressApp = require('./src/express-app');
const StartServer = async () => {
    requireVars('CUSTOMERS_URL', 'APP_SECRET');
    const app = express();
    await expressApp(app);
    app.listen(PORT, () => console.log(`Shopping listening on port ${PORT}`));
};
StartServer().catch((err) => { console.error(err); process.exit(1); });
