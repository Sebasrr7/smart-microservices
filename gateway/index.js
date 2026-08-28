const express = require('express');

const config = require('./src/config');
const expressApp = require('./src/express-app');

const app = express();

async function start() {
    try {
        await expressApp(app);

        app.listen(config.PORT, () => {
            console.log(
                `API Gateway listening on port ${config.PORT}`
            );
        });
    } catch (error) {
        console.error('Gateway startup failed:', error);
        process.exit(1);
    }
}

start();