jest.mock('../../src/database', () => ({
    ProductRepository: jest.fn(),
}));

jest.mock('../../src/utils', () => ({
    FormateData: jest.fn((data) => ({ data })),
}));

const ProductsService = require('../../src/services/products-service');

const { ProductRepository } = require('../../src/database');
const { FormateData } = require('../../src/utils');

describe('ProductsService - GetProducts', () => {
    let service;
    let repository;

    beforeEach(() => {
        repository = {
            FindAll: jest.fn(),
            FindById: jest.fn(),
        };

        ProductRepository.mockImplementation(() => repository);

        service = new ProductsService();
    });

    test('debe devolver productos y categorías', async () => {
        const products = [
            { _id: '1', name: 'Toyota', type: 'SUV' },
            { _id: '2', name: 'Mazda', type: 'Sedan' },
            { _id: '3', name: 'Ford', type: 'SUV' },
        ];

        repository.FindAll.mockResolvedValue(products);

        const result = await service.GetProducts();

        expect(repository.FindAll).toHaveBeenCalledTimes(1);

        expect(FormateData).toHaveBeenCalledWith({
            products,
            categories: ['SUV', 'Sedan'],
        });

        expect(result).toEqual({
            data: {
                products,
                categories: ['SUV', 'Sedan'],
            },
        });
    });
});

describe('ProductsService - GetProductById', () => {
    let service;
    let repository;

    beforeEach(() => {
        repository = {
            FindAll: jest.fn(),
            FindById: jest.fn(),
        };

        ProductRepository.mockImplementation(() => repository);

        service = new ProductsService();
    });

    test('debe devolver un producto por su id', async () => {
        const product = {
            _id: '123',
            name: 'Toyota Corolla',
            type: 'Sedan',
            price: 25000,
        };

        repository.FindById.mockResolvedValue(product);

        const result = await service.GetProductById('123');

        expect(repository.FindById).toHaveBeenCalledWith('123');

        expect(result).toEqual({
            data: product,
        });
    });

    test('debe propagar un error del repositorio', async () => {
        const error = new Error('Database error');

        repository.FindById.mockRejectedValue(error);

        await expect(
            service.GetProductById('123')
        ).rejects.toThrow('Database error');
    });
});
