const mongoose = require('mongoose');
const { CUSTOMERS_URL } = require('../config');
const { APIError, BadRequestError } = require('../utils/app-errors');
const { FormateData } = require('../utils');

class ShoppingService {
    async customerRequest(path, token, options = {}) {
        const response = await fetch(`${CUSTOMERS_URL.replace(/\/$/, '')}${path}`, {
            ...options,
            headers: { 'Content-Type': 'application/json', ...(options.headers || {}), Authorization: `Bearer ${token}` },
        });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new APIError('CustomerServiceError', response.status, body.message || 'Customer service error');
        return body;
    }
    async PlaceOrder(customerId, txnId, token) {
        try {
            const cartResponse = await this.customerRequest('/customer/cart', token);
            const cart = cartResponse.data || [];
            if (!cart.length) throw new BadRequestError('Cart is empty');
            const amount = cart.reduce((total, item) => total + Number(item.product.price || 0) * Number(item.unit || 0), 0);
            const order = { _id: new mongoose.Types.ObjectId().toString(), amount, txnId, status: 'received', items: cart, date: new Date() };
            const result = await this.customerRequest('/customer/internal/order', token, { method: 'POST', body: JSON.stringify(order) });
            return FormateData(result.data);
        } catch (err) {
            if (err instanceof APIError) throw err;
            throw new APIError('PlaceOrderError', 500, err.message);
        }
    }
}
module.exports = ShoppingService;
