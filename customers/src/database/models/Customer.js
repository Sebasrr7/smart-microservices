const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductSchema = new Schema(
    {
        _id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            trim: true,
        },
        desc: {
            type: String,
            trim: true,
        },
        type: {
            type: String,
            trim: true,
        },
        banner: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            min: 0,
        },
        available: {
            type: Boolean,
            default: true,
        },
    },
    {
        _id: false,
    }
);

const OrderItemSchema = new Schema(
    {
        product: {
            type: Schema.Types.Mixed,
            required: true,
        },
        unit: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    {
        _id: false,
    }
);

const OrderSchema = new Schema(
    {
        _id: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            min: 0,
        },
        txnId: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: [
                'received',
                'confirmed',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
            ],
            default: 'received',
        },
        items: {
            type: [OrderItemSchema],
            default: [],
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        _id: false,
    }
);

const CustomerSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        salt: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        address: [
            {
                type: Schema.Types.ObjectId,
                ref: 'address',
            },
        ],

        cart: {
            type: [
                {
                    product: {
                        type: ProductSchema,
                        required: true,
                    },
                    unit: {
                        type: Number,
                        required: true,
                        min: 1,
                    },
                },
            ],
            default: [],
        },

        wishlist: {
            type: [ProductSchema],
            default: [],
        },

        orders: {
            type: [OrderSchema],
            default: [],
        },
    },
    {
        timestamps: true,

        toJSON: {
            transform(doc, ret) {
                delete ret.password;
                delete ret.salt;
                delete ret.__v;
            },
        },
    }
);

module.exports = mongoose.model('customer', CustomerSchema);