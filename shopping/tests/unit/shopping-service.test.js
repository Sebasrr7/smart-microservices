jest.mock('../../src/database/models/Order', () => ({
    create: jest.fn(),
}));

jest.mock('../../src/utils', () => ({
    FormateData: jest.fn((data) => ({ data })),
}));

const Order = require('../../src/database/models/Order');
const { FormateData } = require('../../src/utils');
const ShoppingService = require('../../src/services/shopping-service');

describe('ShoppingService - PlaceOrder', () => {
    let service;

    beforeEach(() => {
        service = new ShoppingService();
        jest.clearAllMocks();
    });

    test('debe crear una orden usando el carrito del cliente', async () => {
        const cart = [
            {
                product: {
                    _id: 'product-1',
                    name: 'Toyota Corolla',
                    price: 100,
                },
                unit: 2,
            },
            {
                product: {
                    _id: 'product-2',
                    name: 'Mazda 3',
                    price: 50,
                },
                unit: 1,
            },
        ];

        service.customerRequest = jest
            .fn()
            .mockResolvedValueOnce({
                data: cart,
            })
            .mockResolvedValueOnce({
                data: {
                    _id: 'customer-order-1',
                },
            });

        Order.create.mockResolvedValue({
            _id: 'shopping-order-1',
            customerId: 'customer-123',
            amount: 250,
            txnId: 'txn-123',
            status: 'received',
            items: cart,
            toObject() {
                return {
                    _id: 'shopping-order-1',
                    amount: 250,
                    txnId: 'txn-123',
                    status: 'received',
                    items: cart,
                };
            },
        });

        const result = await service.PlaceOrder(
            'customer-123',
            'txn-123',
            'test-token'
        );

        expect(service.customerRequest).toHaveBeenCalledTimes(2);

        expect(Order.create).toHaveBeenCalledWith(
            expect.objectContaining({
                customerId: 'customer-123',
                amount: 250,
                txnId: 'txn-123',
                status: 'received',
                items: cart,
            })
        );

        expect(FormateData).toHaveBeenCalled();

        expect(result.data.amount).toBe(250);
        expect(result.data.customerId).toBe('customer-123');
    });

    test('debe rechazar un carrito vacío', async () => {
        service.customerRequest = jest
            .fn()
            .mockResolvedValue({
                data: [],
            });

        await expect(
            service.PlaceOrder(
                'customer-123',
                'txn-123',
                'test-token'
            )
        ).rejects.toThrow('Cart is empty');

        expect(Order.create).not.toHaveBeenCalled();
    });

    test('debe propagar errores del servicio de customers', async () => {
        service.customerRequest = jest
            .fn()
            .mockRejectedValue(
                new Error('Customer service unavailable')
            );

        await expect(
            service.PlaceOrder(
                'customer-123',
                'txn-123',
                'test-token'
            )
        ).rejects.toThrow('Customer service unavailable');

        expect(Order.create).not.toHaveBeenCalled();
    });
});
