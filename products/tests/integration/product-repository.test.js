const mongoose = require('mongoose');
const {
    MongoMemoryServer,
} = require('mongodb-memory-server');

const ProductRepository = require(
    '../../src/database/repository/product-repository'
);

const {
    ProductModel,
} = require('../../src/database/models');

describe('ProductRepository - MongoDB', () => {
    let mongoServer;
    let repository;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();

        await mongoose.connect(
            mongoServer.getUri()
        );

        repository = new ProductRepository();
    });

    afterEach(async () => {
        await ProductModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    test('FindAll debe devolver todos los productos', async () => {
        await ProductModel.create([
            {
                name: 'Toyota Corolla',
                desc: 'Sedan',
                type: 'Sedan',
                price: 25000,
            },
            {
                name: 'Ford Explorer',
                desc: 'SUV',
                type: 'SUV',
                price: 35000,
            },
        ]);

        const products = await repository.FindAll();

        expect(products).toHaveLength(2);
        expect(products[0].name).toBe('Toyota Corolla');
        expect(products[1].name).toBe('Ford Explorer');
    });

    test('FindById debe devolver un producto existente', async () => {
        const product = await ProductModel.create({
            name: 'Mazda CX-5',
            type: 'SUV',
            price: 30000,
        });

        const result = await repository.FindById(
            product._id.toString()
        );

        expect(result.name).toBe('Mazda CX-5');
        expect(result.type).toBe('SUV');
    });

    test('FindById debe lanzar error si el producto no existe', async () => {
        const fakeId = new mongoose.Types.ObjectId();

        await expect(
            repository.FindById(fakeId)
        ).rejects.toMatchObject({
            name: 'NotFoundError',
            statusCode: 404,
        });
    });
});
