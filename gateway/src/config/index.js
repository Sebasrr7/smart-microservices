require('dotenv').config({ quiet: true });

const config = {
    PORT: Number(process.env.PORT) || 8000,

    CUSTOMERS_URL:
        process.env.CUSTOMERS_URL || 'http://customers:8001',

    PRODUCTS_URL:
        process.env.PRODUCTS_URL || 'http://products:8002',

    SHOPPING_URL:
        process.env.SHOPPING_URL || 'http://shopping:8003',

    FRONTEND_URL:
        process.env.FRONTEND_URL || '*',
};

module.exports = config;