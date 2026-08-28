const express = require('express');
const { PORT, requireVars } = require('./src/config');
const databaseConnection = require('./src/database/connection');
const expressApp = require('./src/express-app');

const StartServer = async () => {
    try {
        requireVars('DB_URL', 'CUSTOMERS_URL', 'APP_SECRET');

        const app = express();

        await databaseConnection();
        await expressApp(app);

        app.listen(PORT, () => {
            console.log(`Shopping listening on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start shopping service:', err);
        process.exit(1);
    }
};

StartServer();
