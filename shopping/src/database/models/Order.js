const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
    {
        customerId: {
            type: String,
            required: true,
        },

        txnId: {
            type: String,
            required: false,
        },

        amount: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            default: 'received',
        },

        items: {
            type: Array,
            required: true,
        },

        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Order', OrderSchema);
