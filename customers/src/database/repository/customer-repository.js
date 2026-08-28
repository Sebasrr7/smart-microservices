const { CustomerModel, AddressModel } = require('../models');

const { BadRequestError } = require('../../utils/app-errors');

const idOf = (value) => String(value);

class CustomerRepository {
    async CreateCustomer(data) {
        try {
            return await CustomerModel.create(data);
        } catch (error) {
            if (error.code === 11000) {
                throw new BadRequestError(
                    'Email already registered'
                );
            }

            throw error;
        }
    }

    async FindCustomer({ email }) {
        if (!email) {
            return null;
        }

        return CustomerModel.findOne({
            email: email.toLowerCase().trim(),
        });
    }

    async AddNewAddress(customerId, data) {
        const customer = await CustomerModel.findById(customerId);

        if (!customer) {
            throw new BadRequestError('Customer not found');
        }

        if (
            !data?.street ||
            !data?.city ||
            !data?.country
        ) {
            throw new BadRequestError(
                'Street, city and country are required'
            );
        }

        const address = await AddressModel.create({
            street: data.street.trim(),
            postalCode: data.postalCode?.trim(),
            city: data.city.trim(),
            country: data.country.trim(),
        });

        customer.address.push(address._id);

        await customer.save();

        return address;
    }

    async GetProfile(customerId) {
        const customer = await CustomerModel
            .findById(customerId)
            .populate('address');

        if (!customer) {
            throw new BadRequestError('Customer not found');
        }

        return customer;
    }

    async GetWishList(customerId) {
        const customer = await CustomerModel.findById(customerId);

        if (!customer) {
            throw new BadRequestError('Customer not found');
        }

        return customer.wishlist;
    }

    async AddToWishlist(customerId, product) {
        if (!product?._id) {
            throw new BadRequestError(
                'Product id is required'
            );
        }

        const customer = await CustomerModel.findById(customerId);

        if (!customer) {
            throw new BadRequestError('Customer not found');
        }

        const productId = idOf(product._id);

        const alreadyExists = customer.wishlist.some(
            (item) => idOf(item._id) === productId
        );

        if (!alreadyExists) {
            customer.wishlist.push({
                _id: productId,
                name: product.name,
                desc: product.desc,
                type: product.type,
                banner: product.banner,
                price: product.price,
                available: product.available,
            });
        }

        await customer.save();

        return customer.wishlist;
    }

    async RemoveFromWishlist(customerId, productId) {
        if (!productId) {
            throw new BadRequestError(
                'Product id is required'
            );
        }

        const customer = await CustomerModel.findById(customerId);

        if (!customer) {
            throw new BadRequestError('Customer not found');
        }

        customer.wishlist = customer.wishlist.filter(
            (item) => idOf(item._id) !== idOf(productId)
        );

        await customer.save();

        return customer.wishlist;
    }

    async AddToCart(customerId, product, qty) {
        if (!product?._id) {
            throw new BadRequestError(
                'Product id is required'
            );
        }

        const customer = await CustomerModel.findById(customerId);

        if (!customer) {
            throw new BadRequestError('Customer not found');
        }

        const quantity = Number(qty);

        if (
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {
            throw new BadRequestError(
                'qty must be a positive integer'
            );
        }

        const productId = idOf(product._id);

        const existingItem = customer.cart.find(
            (item) =>
                idOf(item.product._id) === productId
        );

        if (existingItem) {
            existingItem.unit = quantity;
        } else {
            customer.cart.push({
                product: {
                    _id: productId,
                    name: product.name,
                    desc: product.desc,
                    type: product.type,
                    banner: product.banner,
                    price: product.price,
                    available: product.available,
                },
                unit: quantity,
            });
        }

        await customer.save();

        return customer.cart;
    }

    async RemoveFromCart(customerId, productId) {
        if (!productId) {
            throw new BadRequestError(
                'Product id is required'
            );
        }

        const customer = await CustomerModel.findById(customerId);

        if (!customer) {
            throw new BadRequestError('Customer not found');
        }

        customer.cart = customer.cart.filter(
            (item) =>
                idOf(item.product._id) !== idOf(productId)
        );

        await customer.save();

        return customer.cart;
    }

    async GetCart(customerId) {
        const customer = await CustomerModel.findById(customerId);

        if (!customer) {
            throw new BadRequestError('Customer not found');
        }

        return customer.cart;
    }

    async PlaceOrder(customerId, order) {
        if (!order || typeof order !== 'object') {
            throw new BadRequestError(
                'Order data is required'
            );
        }

        if (!order._id) {
            throw new BadRequestError(
                'Order id is required'
            );
        }

        if (
            !Array.isArray(order.items) ||
            order.items.length === 0
        ) {
            throw new BadRequestError(
                'Order must contain at least one item'
            );
        }

        const customer = await CustomerModel.findById(customerId);

        if (!customer) {
            throw new BadRequestError(
                'Customer not found'
            );
        }

        customer.orders.push({
            _id: String(order._id),
            amount: order.amount,
            txnId: order.txnId,
            status: order.status || 'received',
            items: order.items,
            date: order.date || new Date(),
        });

        customer.cart = [];

        await customer.save();

        return order;
    }
}

module.exports = CustomerRepository;