const express = require('express');
const request = require('supertest');

jest.mock('../../src/services/products-service');

const ProductsService = require(
    '../../src/services/products-service'
);

const expressApp = require('../../src/express-app');

describe('Products API', () => {
    let app;
    let service;

    beforeAll(async () => {
        app = express();

        await expressApp(app);

        service = ProductsService.mock.instances[0];
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /products debe devolver productos y categorías', async () => {
        service.GetProducts.mockResolvedValue({
            data: {
                products: [
                    {
                        _id: '1',
                        name: 'Toyota Corolla',
                        type: 'Sedan',
                        price: 25000,
                    },
                ],
                categories: ['Sedan'],
            },
        });

        const response = await request(app)
            .get('/products');

        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual({
            products: [
                {
                    _id: '1',
                    name: 'Toyota Corolla',
                    type: 'Sedan',
                    price: 25000,
                },
            ],
            categories: ['Sedan'],
        });

        expect(
            service.GetProducts
        ).toHaveBeenCalledTimes(1);
    });

    test('GET /products/:id debe devolver un producto', async () => {
        service.GetProductById.mockResolvedValue({
            data: {
                _id: '123',
                name: 'Mazda CX-5',
                type: 'SUV',
                price: 30000,
            },
        });

        const response = await request(app)
            .get('/products/123');

        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual({
            _id: '123',
            name: 'Mazda CX-5',
            type: 'SUV',
            price: 30000,
        });

        expect(
            service.GetProductById
        ).toHaveBeenCalledWith('123');
    });
});
