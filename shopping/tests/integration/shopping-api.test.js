const express = require('express');
const request = require('supertest');

jest.mock('../../src/services/shopping-service');

jest.mock('../../src/api/middlewares/auth', () => {
    return (req, res, next) => {
        req.user = {
            _id: 'customer-123',
        };

        next();
    };
});

const ShoppingService = require(
    '../../src/services/shopping-service'
);

const expressApp = require(
    '../../src/express-app'
);

describe('Shopping API', () => {
    let app;
    let service;

    beforeAll(async () => {
        app = express();

        await expressApp(app);

        service = ShoppingService.mock.instances[0];
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /health debe responder correctamente', async () => {
        const response = await request(app)
            .get('/health');

        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual({
            service: 'shopping',
            status: 'ok',
        });
    });

    test('POST /shopping/order debe crear una orden', async () => {
        service.PlaceOrder.mockResolvedValue({
            data: {
                _id: 'order-123',
                customerId: 'customer-123',
                amount: 250,
            },
        });

        const response = await request(app)
            .post('/shopping/order')
            .set(
                'Authorization',
                'Bearer test-token'
            )
            .send({
                txnId: 'txn-123',
            });

        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual({
            _id: 'order-123',
            customerId: 'customer-123',
            amount: 250,
        });

        expect(service.PlaceOrder)
            .toHaveBeenCalledWith(
                'customer-123',
                'txn-123',
                'test-token'
            );
    });
});
