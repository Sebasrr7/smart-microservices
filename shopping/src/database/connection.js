const mongoose = require('mongoose');
const { DB_URL } = require('../config');

const databaseConnection = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log('Shopping database connected');
    } catch (error) {
        console.error('Shopping database connection error:', error);
        throw error;
    }
};

module.exports = databaseConnection;
