jest.mock('../../src/database', () => ({
    CustomerRepository: jest.fn(),
}));

jest.mock('../../src/utils', () => ({
    FormateData: jest.fn((data) => ({ data })),
    GeneratePassword: jest.fn(async () => 'hashed-password'),
    GenerateSalt: jest.fn(async () => 'salt-value'),
    GenerateSignature: jest.fn(async () => 'test-token'),
    ValidatePassword: jest.fn(),
}));

const CustomerService = require('../../src/services/customer-service');

const {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
} = require('../../src/utils');

const {
    CustomerRepository,
} = require('../../src/database');

describe('CustomerService - SignUp', () => {
    let service;
    let repository;

    beforeEach(() => {
        jest.clearAllMocks();

        repository = {
            CreateCustomer: jest.fn(),
        };

        CustomerRepository.mockImplementation(
            () => repository
        );

        service = new CustomerService();
    });

    test('debe registrar un cliente correctamente', async () => {
        repository.CreateCustomer.mockResolvedValue({
            _id: 'customer-123',
            email: 'sebas@example.com',
        });

        const result = await service.SignUp({
            email: '  SEBAS@EXAMPLE.COM  ',
            password: '123456',
            phone: '3001234567',
        });

        expect(GenerateSalt).toHaveBeenCalledTimes(1);

        expect(GeneratePassword).toHaveBeenCalledWith(
            '123456',
            'salt-value'
        );

        expect(repository.CreateCustomer).toHaveBeenCalledWith({
            email: 'sebas@example.com',
            password: 'hashed-password',
            phone: '3001234567',
            salt: 'salt-value',
        });

        expect(GenerateSignature).toHaveBeenCalledWith({
            email: 'sebas@example.com',
            _id: 'customer-123',
        });

        expect(FormateData).toHaveBeenCalledWith({
            id: 'customer-123',
            token: 'test-token',
        });

        expect(result).toEqual({
            data: {
                id: 'customer-123',
                token: 'test-token',
            },
        });
    });

    test('debe rechazar el registro sin email', async () => {
        await expect(
            service.SignUp({
                password: '123456',
            })
        ).rejects.toMatchObject({
            name: 'BadRequestError',
            statusCode: 400,
            message: 'Email and password are required',
        });

        expect(
            repository.CreateCustomer
        ).not.toHaveBeenCalled();
    });

    test('debe rechazar el registro sin password', async () => {
        await expect(
            service.SignUp({
                email: 'sebas@example.com',
            })
        ).rejects.toMatchObject({
            name: 'BadRequestError',
            statusCode: 400,
            message: 'Email and password are required',
        });

        expect(
            repository.CreateCustomer
        ).not.toHaveBeenCalled();
    });
});
