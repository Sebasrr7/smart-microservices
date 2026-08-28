const mongoose = require('mongoose');

const { Schema } = mongoose;

const AddressSchema = new Schema(
    {
        street: {
            type: String,
            required: true,
            trim: true,
        },

        postalCode: {
            type: String,
            trim: true,
        },

        city: {
            type: String,
            required: true,
            trim: true,
        },

        country: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('address', AddressSchema);
