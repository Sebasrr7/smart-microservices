const { CustomerRepository } = require('../database');

const {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} = require('../utils');

const {
    APIError,
    BadRequestError,
} = require('../utils/app-errors');

class CustomerService {
    constructor() {
        this.repository = new CustomerRepository();
    }

    async SignIn({ email, password }) {
        if (!email || !password) {
            throw new BadRequestError(
                'Email and password are required'
            );
        }

        try {
            const customer =
                await this.repository.FindCustomer({
                    email,
                });

            if (
                !customer ||
                !(await ValidatePassword(
                    password,
                    customer.password,
                    customer.salt
                ))
            ) {
                throw new BadRequestError(
                    'Invalid credentials'
                );
            }

            return FormateData({
                id: customer._id,
                token: await GenerateSignature({
                    email: customer.email,
                    _id: customer._id,
                }),
            });
        } catch (error) {
            if (error instanceof APIError) {
                throw error;
            }

            throw new APIError(
                'SignInError',
                500,
                error.message
            );
        }
    }

    async SignUp({ email, password, phone }) {
        if (!email || !password) {
            throw new BadRequestError(
                'Email and password are required'
            );
        }

        try {
            const normalizedEmail =
                email.toLowerCase().trim();

            const salt = await GenerateSalt();

            const hashedPassword =
                await GeneratePassword(
                    password,
                    salt
                );

            const customer =
                await this.repository.CreateCustomer({
                    email: normalizedEmail,
                    password: hashedPassword,
                    phone,
                    salt,
                });

            return FormateData({
                id: customer._id,
                token: await GenerateSignature({
                    email: customer.email,
                    _id: customer._id,
                }),
            });
        } catch (error) {
            if (error instanceof APIError) {
                throw error;
            }

            throw new APIError(
                'SignUpError',
                500,
                error.message
            );
        }
    }

    AddNewAddress(id, data) {
        return this.repository
            .AddNewAddress(id, data)
            .then(FormateData);
    }

    GetProfile(id) {
        return this.repository
            .GetProfile(id)
            .then(FormateData);
    }

    async GetShopingDetails(id) {
        const profile =
            await this.repository.GetProfile(id);

        return FormateData({
            cart: profile.cart,
            wishlist: profile.wishlist,
            orders: profile.orders,
        });
    }

    GetWishList(id) {
        return this.repository
            .GetWishList(id)
            .then(FormateData);
    }

    AddToWishlist(id, product) {
        return this.repository
            .AddToWishlist(id, product)
            .then(FormateData);
    }

    RemoveFromWishlist(id, productId) {
        return this.repository
            .RemoveFromWishlist(id, productId)
            .then(FormateData);
    }

    AddToCart(id, product, quantity) {
        return this.repository
            .AddToCart(id, product, quantity)
            .then(FormateData);
    }

    RemoveFromCart(id, productId) {
        return this.repository
            .RemoveFromCart(id, productId)
            .then(FormateData);
    }

    GetCart(id) {
        return this.repository
            .GetCart(id)
            .then(FormateData);
    }

    PlaceOrder(id, order) {
        return this.repository
            .PlaceOrder(id, order)
            .then(FormateData);
    }
}

module.exports = CustomerService;