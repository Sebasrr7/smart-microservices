const mongoose = require('mongoose');

const Order = require('../database/models/Order');

const { CUSTOMERS_URL } = require('../config');

const { APIError, BadRequestError } = require('../utils/app-errors');

const { FormateData } = require('../utils');

class ShoppingService {

    async customerRequest(path, token, options = {}) {
        const response = await fetch(
            `${CUSTOMERS_URL.replace(/\/$/, '')}${path}`,
            {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...(options.headers || {}),
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const body = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new APIError(
                'CustomerServiceError',
                response.status,
                body.message || 'Customer service error'
            );
        }

        return body;
    }

    async PlaceOrder(customerId, txnId, token) {
        try {
            // 1. Obtener el carrito del cliente
            const cartResponse = await this.customerRequest(
                '/customer/cart',
                token
            );

            // Customers puede devolver { data: [...] }
            // o directamente [...]
            const cart = Array.isArray(cartResponse)
                ? cartResponse
                : (cartResponse.data || []);

            // 2. Verificar que el carrito tenga productos
            if (!cart.length) {
                throw new BadRequestError('Cart is empty');
            }

            // 3. Calcular el valor total
            const amount = cart.reduce(
                (total, item) => {
                    const price = Number(item.product?.price || 0);
                    const quantity = Number(item.unit || 0);

                    return total + (price * quantity);
                },
                0
            );

            // 4. Crear un ID único para la orden
            const orderId = new mongoose.Types.ObjectId().toString();

            // 5. Preparar la orden
            const orderData = {
                _id: orderId,
                amount,
                txnId,
                status: 'received',
                items: cart,
                date: new Date(),
            };

            // 6. Enviar la orden a Customers.
            //
            // Customers:
            // - guarda la orden en customer.orders
            // - vacía customer.cart
            // - guarda los cambios en MongoDB
            const customerOrderResponse = await this.customerRequest(
                '/customer/internal/order',
                token,
                {
                    method: 'POST',
                    body: JSON.stringify(orderData),
                }
            );

            const customerOrder =
                customerOrderResponse?.data || customerOrderResponse;

            // 7. Guardar también la orden en la base de datos de Shopping
            const order = await Order.create({
                customerId,
                amount,
                txnId,
                status: 'received',
                items: cart,
                date: orderData.date,
            });

            // 8. Devolver la orden creada
            return FormateData({
                ...order.toObject(),
                customerId,
                _id: order._id,
                customerOrderId: customerOrder?._id || orderId,
            });

        } catch (err) {
            if (err instanceof APIError) {
                throw err;
            }

            throw new APIError(
                'PlaceOrderError',
                500,
                err.message
            );
        }
    }
}

module.exports = ShoppingService;
