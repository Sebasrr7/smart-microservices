const express = require('express');

const {
    CUSTOMERS_URL,
    PRODUCTS_URL,
    SHOPPING_URL,
} = require('./config');

const router = express.Router();

const proxyRequest = async (req, res, next, baseUrl) => {
    try {
        const path = req.originalUrl;

        const url = `${baseUrl.replace(/\/$/, '')}${path}`;

        const headers = {
            'Content-Type': 'application/json',
        };

        if (req.headers.authorization) {
            headers.Authorization = req.headers.authorization;
        }

        const options = {
            method: req.method,
            headers,
        };

        if (!['GET', 'HEAD'].includes(req.method)) {
            options.body = JSON.stringify(req.body);
        }

        const response = await fetch(url, options);

        const contentType =
            response.headers.get('content-type') || '';

        const body = contentType.includes('application/json')
            ? await response.json()
            : await response.text();

        res.status(response.status);

        if (contentType.includes('application/json')) {
            return res.json(body);
        }

        return res.send(body);
    } catch (error) {
        next(error);
    }
};

/*
 * CUSTOMERS
 *
 * /customer/signup
 * /customer/login
 * /customer/profile
 * /customer/address
 * /customer/cart
 * /customer/wishlist
 * etc.
 */
router.use('/customer', (req, res, next) => {
    proxyRequest(req, res, next, CUSTOMERS_URL);
});

/*
 * PRODUCTS
 *
 * /products
 * /products/:id
 */
router.use('/products', (req, res, next) => {
    proxyRequest(req, res, next, PRODUCTS_URL);
});

/*
 * SHOPPING
 *
 * /shopping/order
 */
router.use('/shopping', (req, res, next) => {
    proxyRequest(req, res, next, SHOPPING_URL);
});

module.exports = router;