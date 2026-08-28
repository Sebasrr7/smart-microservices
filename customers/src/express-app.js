const express = require('express');
const cors = require('cors');

const customer = require('./api/customer');
const HandleErrors = require('./utils/error-handler');

module.exports = async (app) => {
    app.use(express.json({ limit: '1mb' }));

    app.use(
        express.urlencoded({
            extended: true,
            limit: '1mb',
        })
    );

    app.use(cors());

    app.get('/health', (req, res) => {
        return res.status(200).json({
            service: 'customers',
            status: 'ok',
        });
    });

    app.use('/customer', customer);

    app.use(HandleErrors);
};
