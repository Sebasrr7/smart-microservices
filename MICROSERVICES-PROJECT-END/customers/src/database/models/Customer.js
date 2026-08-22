const mongoose = require('mongoose');
const { Schema } = mongoose;
const productFields = {
    _id: { type: String, required: true }, name: String, desc: String,
    type: String, banner: String, price: Number, available: Boolean
};
const CustomerSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, salt: { type: String, required: true }, phone: String,
    address: [{ type: Schema.Types.ObjectId, ref: 'address' }],
    cart: [{ product: productFields, unit: { type: Number, required: true, min: 1 } }],
    wishlist: [productFields],
    orders: [{
        _id: { type: String, required: true }, amount: Number, txnId: String,
        status: { type: String, default: 'received' },
        items: [{ product: Schema.Types.Mixed, unit: Number }],
        date: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true,
    toJSON: { transform(doc, ret) { delete ret.password; delete ret.salt; delete ret.__v; } }
});
module.exports = mongoose.model('customer', CustomerSchema);
