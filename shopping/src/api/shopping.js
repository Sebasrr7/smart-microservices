const express = require('express');
const ShoppingService = require('../services/shopping-service');
const UserAuth = require('./middlewares/auth');
const service = new ShoppingService();
const router = express.Router();
router.post('/order', UserAuth, async (req,res,next)=>{
    try {
        const { txnId } = req.body;
        const token = req.headers.authorization.slice(7);
        const { data } = await service.PlaceOrder(req.user._id, txnId, token);
        res.json(data);
    } catch(e){ next(e); }
});
module.exports = router;
