const mongoose = require('mongoose');
const { Schema } = mongoose;
const AddressSchema = new Schema({
    street: { type: String, required: true },
    postalCode: String,
    city: { type: String, required: true },
    country: { type: String, required: true }
}, { timestamps: true });
module.exports = mongoose.model('address', AddressSchema);
