const express = require('express');
const cors = require('cors');
const shopping = require('./api/shopping');
const HandleErrors = require('./utils/error-handler');
module.exports = async (app) => {
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(cors());
    app.get('/health', (req,res)=>res.json({ service: 'shopping', status: 'ok' }));
    app.use('/shopping', shopping);
    app.use(HandleErrors);
};
