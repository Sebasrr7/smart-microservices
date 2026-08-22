const mongoose = require('mongoose');
const { DB_URL } = require('../config');
module.exports = async () => {
    await mongoose.connect(DB_URL);
    console.log('Customers database connected');
};
