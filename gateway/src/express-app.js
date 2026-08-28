const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const HandleErrors = require('./utils/error-handler');

module.exports = async (app) => {
    app.use(express.json({ limit: '1mb' }));

    app.use(
        express.urlencoded({
            extended: true,
            limit: '1mb',
        })
    );

    app.use(
        cors({
            origin: true,
            credentials: true,
        })
    );

    app.get('/health', (req, res) => {
        return res.status(200).json({
            service: 'gateway',
            status: 'ok',
        });
    });

    app.use('/', routes);

    app.use(HandleErrors);
};