const { CustomerRepository } = require('../database');
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } = require('../utils');
const { APIError, BadRequestError } = require('../utils/app-errors');
class CustomerService {
    constructor(){ this.repository=new CustomerRepository(); }
    async SignIn({email,password}){ try { const c=await this.repository.FindCustomer({email}); if(!c||!(await ValidatePassword(password,c.password,c.salt))) throw new BadRequestError('Invalid credentials'); return FormateData({id:c._id,token:await GenerateSignature({email:c.email,_id:c._id})}); } catch(e){if(e instanceof APIError)throw e;throw new APIError('SignInError',500,e.message);} }
    async SignUp({email,password,phone}){ if(!email||!password)throw new BadRequestError('Email and password are required'); try {const salt=await GenerateSalt();const c=await this.repository.CreateCustomer({email,password:await GeneratePassword(password,salt),phone,salt});return FormateData({id:c._id,token:await GenerateSignature({email:c.email,_id:c._id})});}catch(e){if(e instanceof APIError)throw e;throw new APIError('SignUpError',500,e.message);} }
    AddNewAddress(id,d){return this.repository.AddNewAddress(id,d).then(FormateData)}
    GetProfile(id){return this.repository.GetProfile(id).then(FormateData)}
    async GetShopingDetails(id){const p=await this.repository.GetProfile(id);return FormateData({cart:p.cart,wishlist:p.wishlist,orders:p.orders});}
    GetWishList(id){return this.repository.GetWishList(id).then(FormateData)}
    AddToWishlist(id,p){return this.repository.AddToWishlist(id,p).then(FormateData)}
    RemoveFromWishlist(id,p){return this.repository.RemoveFromWishlist(id,p).then(FormateData)}
    AddToCart(id,p,q){return this.repository.AddToCart(id,p,q).then(FormateData)}
    RemoveFromCart(id,p){return this.repository.RemoveFromCart(id,p).then(FormateData)}
    GetCart(id){return this.repository.GetCart(id).then(FormateData)}
    PlaceOrder(id,o){return this.repository.PlaceOrder(id,o).then(FormateData)}
}
module.exports=CustomerService;
