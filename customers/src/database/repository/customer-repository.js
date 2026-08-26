const { CustomerModel, AddressModel } = require('../models');
const { BadRequestError } = require('../../utils/app-errors');
const idOf = (value) => String(value);
class CustomerRepository {
    async CreateCustomer(data) {
        try { return await CustomerModel.create(data); }
        catch (err) { if (err.code === 11000) throw new BadRequestError('Email already registered'); throw err; }
    }
    FindCustomer({ email }) { return CustomerModel.findOne({ email: email.toLowerCase() }); }
    async AddNewAddress(id, data) {
        const customer = await CustomerModel.findById(id); if (!customer) throw new BadRequestError('Customer not found');
        const address = await AddressModel.create(data); customer.address.push(address._id); await customer.save(); return address;
    }
    async GetProfile(id) { const customer = await CustomerModel.findById(id).populate('address'); if (!customer) throw new BadRequestError('Customer not found'); return customer; }
    async GetWishList(id) { const c = await CustomerModel.findById(id); if (!c) throw new BadRequestError('Customer not found'); return c.wishlist; }
    async AddToWishlist(id, product) {
        const c = await CustomerModel.findById(id); if (!c) throw new BadRequestError('Customer not found');
        const pid = idOf(product._id); if (!c.wishlist.some(x => idOf(x._id) === pid)) c.wishlist.push({ ...product, _id: pid });
        await c.save(); return c.wishlist;
    }
    async RemoveFromWishlist(id, productId) { const c=await CustomerModel.findById(id); if(!c) throw new BadRequestError('Customer not found'); c.wishlist=c.wishlist.filter(x=>idOf(x._id)!==idOf(productId)); await c.save(); return c.wishlist; }
    async AddToCart(id, product, qty) {
        const c=await CustomerModel.findById(id); if(!c) throw new BadRequestError('Customer not found');
        const quantity=Number(qty); if(!Number.isInteger(quantity)||quantity<1) throw new BadRequestError('qty must be a positive integer');
        const pid=idOf(product._id); const existing=c.cart.find(x=>idOf(x.product._id)===pid);
        if(existing) existing.unit=quantity; else c.cart.push({ product:{...product,_id:pid}, unit:quantity });
        await c.save(); return c.cart;
    }
    async RemoveFromCart(id, productId) { const c=await CustomerModel.findById(id); if(!c) throw new BadRequestError('Customer not found'); c.cart=c.cart.filter(x=>idOf(x.product._id)!==idOf(productId)); await c.save(); return c.cart; }
    async GetCart(id) { const c=await CustomerModel.findById(id); if(!c) throw new BadRequestError('Customer not found'); return c.cart; }
    async PlaceOrder(id, order) { const c=await CustomerModel.findById(id); if(!c) throw new BadRequestError('Customer not found'); c.orders.push(order); c.cart=[]; await c.save(); return order; }
}
module.exports = CustomerRepository;
