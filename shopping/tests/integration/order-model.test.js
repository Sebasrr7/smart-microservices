const mongoose = require('mongoose');
const {
    MongoMemoryServer,
} = require('mongodb-memory-server');

const Order = require(
    '../../src/database/models/Order'
);

describe('Shopping - Order Model', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer =
            await MongoMemoryServer.create();

        await mongoose.connect(
            mongoServer.getUri()
        );
    });

    afterEach(async () => {
        await Order.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    test('debe guardar una orden correctamente', async () => {
        const order = await Order.create({
            customerId: 'customer-123',
            txnId: 'txn-123',
            amount: 250,
            status: 'received',
            items: [
                {
                    product: {
                        _id: 'product-1',
                        name: 'Toyota Corolla',
                        price: 100,
                    },
                    unit: 2,
                },
            ],
        });

        expect(order._id).toBeDefined();
        expect(order.customerId).toBe('customer-123');
        expect(order.amount).toBe(250);
        expect(order.txnId).toBe('txn-123');
        expect(order.status).toBe('received');
        expect(order.items).toHaveLength(1);
    });

    test('debe rechazar una orden sin customerId', async () => {
        await expect(
            Order.create({
                amount: 100,
                items: [],
            })
        ).rejects.toThrow();
    });
});
