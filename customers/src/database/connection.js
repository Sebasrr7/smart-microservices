const mongoose = require('mongoose');

const { DB_URL } = require('../config');

module.exports = async () => {
    if (!DB_URL) {
        throw new Error(
            'DB_URL environment variable is not configured'
        );
    }

    try {
        await mongoose.connect(DB_URL);

        console.log('Customers database connected');
    } catch (error) {
        console.error(
            'Customers database connection failed:',
            error.message
        );

        throw error;
    }
};
