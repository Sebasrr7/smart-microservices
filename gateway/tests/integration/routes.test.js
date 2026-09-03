const express = require('express');
const request = require('supertest');

jest.mock('../../src/config', () => ({
    CUSTOMERS_URL: 'http://customers-test:8001',
    PRODUCTS_URL: 'http://products-test:8002',
    SHOPPING_URL: 'http://shopping-test:8003',
}));

const expressApp = require('../../src/express-app');

describe('Gateway - Proxy Routes', () => {
    let app;

    beforeAll(async () => {
        app = express();
        await expressApp(app);
    });

    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('GET /products debe reenviar la petición a Products', async () => {
        global.fetch.mockResolvedValue({
            status: 200,
            headers: new Headers({
                'content-type': 'application/json',
            }),
            json: async () => ({
                products: [],
                categories: [],
            }),
        });

        const response = await request(app)
            .get('/products');

        expect(response.statusCode).toBe(200);

        expect(global.fetch).toHaveBeenCalledWith(
            'http://products-test:8002/products',
            expect.objectContaining({
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        );

        expect(response.body).toEqual({
            products: [],
            categories: [],
        });
    });

    test('GET /products/:id debe conservar el id', async () => {
        global.fetch.mockResolvedValue({
            status: 200,
            headers: new Headers({
                'content-type': 'application/json',
            }),
            json: async () => ({
                _id: 'product-123',
                name: 'Toyota Corolla',
            }),
        });

        const response = await request(app)
            .get('/products/product-123');

        expect(response.statusCode).toBe(200);

        expect(global.fetch).toHaveBeenCalledWith(
            'http://products-test:8002/products/product-123',
            expect.objectContaining({
                method: 'GET',
            })
        );

        expect(response.body).toEqual({
            _id: 'product-123',
            name: 'Toyota Corolla',
        });
    });

    test('POST /customer/login debe reenviar body y Authorization', async () => {
        global.fetch.mockResolvedValue({
            status: 200,
            headers: new Headers({
                'content-type': 'application/json',
            }),
            json: async () => ({
                id: 'customer-123',
                token: 'test-token',
            }),
        });

        const response = await request(app)
            .post('/customer/login')
            .set('Authorization', 'Bearer original-token')
            .send({
                email: 'test@example.com',
                password: 'secret',
            });

        expect(response.statusCode).toBe(200);

        expect(global.fetch).toHaveBeenCalledWith(
            'http://customers-test:8001/customer/login',
            expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer original-token',
                },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'secret',
                }),
            })
        );

        expect(response.body).toEqual({
            id: 'customer-123',
            token: 'test-token',
        });
    });

    test('POST /shopping/order debe reenviar la orden', async () => {
        global.fetch.mockResolvedValue({
            status: 201,
            headers: new Headers({
                'content-type': 'application/json',
            }),
            json: async () => ({
                data: {
                    _id: 'order-123',
                    amount: 500,
                },
            }),
        });

        const response = await request(app)
            .post('/shopping/order')
            .set('Authorization', 'Bearer shopping-token')
            .send({
                txnId: 'txn-123',
            });

        expect(response.statusCode).toBe(201);

        expect(global.fetch).toHaveBeenCalledWith(
            'http://shopping-test:8003/shopping/order',
            expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer shopping-token',
                },
                body: JSON.stringify({
                    txnId: 'txn-123',
                }),
            })
        );

        expect(response.body).toEqual({
            data: {
                _id: 'order-123',
                amount: 500,
            },
        });
    });

    test('debe propagar errores HTTP del microservicio', async () => {
        global.fetch.mockResolvedValue({
            status: 404,
            headers: new Headers({
                'content-type': 'application/json',
            }),
            json: async () => ({
                message: 'Product not found',
            }),
        });

        const response = await request(app)
            .get('/products/not-found');

        expect(response.statusCode).toBe(404);

        expect(response.body).toEqual({
            message: 'Product not found',
        });
    });
});
