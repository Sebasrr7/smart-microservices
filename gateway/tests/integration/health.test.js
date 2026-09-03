const express = require('express');
const request = require('supertest');

const expressApp = require('../../src/express-app');

describe('Gateway - Health Check', () => {
    let app;

    beforeAll(async () => {
        app = express();
        await expressApp(app);
    });

    test('GET /health debe responder 200 y status ok', async () => {
        const response = await request(app)
            .get('/health');

        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual({
            service: 'gateway',
            status: 'ok',
        });
    });
});
