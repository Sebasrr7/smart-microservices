const mongoose = require('mongoose');
const {
    MongoMemoryServer,
} = require('mongodb-memory-server');

const CustomerRepository = require(
    '../../src/database/repository/customer-repository'
);

const {
    CustomerModel,
} = require('../../src/database/models');

describe('CustomerRepository - MongoDB', () => {
    let mongoServer;
    let repository;

    beforeAll(async () => {
        mongoServer =
            await MongoMemoryServer.create();

        const uri = mongoServer.getUri();

        await mongoose.connect(uri);

        repository = new CustomerRepository();
    });

    afterEach(async () => {
        await CustomerModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    test('debe crear y encontrar un cliente', async () => {
        const customer =
            await repository.CreateCustomer({
                email: 'sebas@test.com',
                password: 'hashed-password',
                salt: 'test-salt',
                phone: '3001234567',
            });

        expect(customer.email).toBe(
            'sebas@test.com'
        );

        const found =
            await repository.FindCustomer({
                email: '  SEBAS@TEST.COM  ',
            });

        expect(found).not.toBeNull();
        expect(found.email).toBe(
            'sebas@test.com'
        );
        expect(found.phone).toBe(
            '3001234567'
        );
    });

    test('debe rechazar emails duplicados', async () => {
        await repository.CreateCustomer({
            email: 'duplicado@test.com',
            password: 'hashed-password',
            salt: 'test-salt',
        });

        await expect(
            repository.CreateCustomer({
                email: 'duplicado@test.com',
                password: 'otro-password',
                salt: 'otro-salt',
            })
        ).rejects.toMatchObject({
            name: 'BadRequestError',
            statusCode: 400,
            message: 'Email already registered',
        });
    });
});
