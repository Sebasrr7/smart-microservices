const express = require('express');

const CustomerService = require('../services/customer-service');
const UserAuth = require('./middlewares/auth');

const service = new CustomerService();
const router = express.Router();

const handle = (fn) => async (req, res, next) => {
    try {
        const result = await fn(req);

        return res.json(result.data);
    } catch (error) {
        return next(error);
    }
};

router.post(
    '/signup',
    handle((req) => service.SignUp(req.body))
);

router.post(
    '/login',
    handle((req) => service.SignIn(req.body))
);

router.post(
    '/address',
    UserAuth,
    handle((req) => {
        const {
            street,
            postalCode,
            city,
            country,
        } = req.body;

        return service.AddNewAddress(
            req.user._id,
            {
                street,
                postalCode,
                city,
                country,
            }
        );
    })
);

router.get(
    '/profile',
    UserAuth,
    handle((req) => service.GetProfile(req.user._id))
);

router.get(
    '/shoping-details',
    UserAuth,
    handle((req) =>
        service.GetShopingDetails(req.user._id)
    )
);

router.get(
    '/wishlist',
    UserAuth,
    handle((req) =>
        service.GetWishList(req.user._id)
    )
);

router.put(
    '/wishlist',
    UserAuth,
    handle((req) =>
        service.AddToWishlist(
            req.user._id,
            req.body.product || req.body
        )
    )
);

router.delete(
    '/wishlist/:id',
    UserAuth,
    handle((req) =>
        service.RemoveFromWishlist(
            req.user._id,
            req.params.id
        )
    )
);

router.get(
    '/cart',
    UserAuth,
    handle((req) =>
        service.GetCart(req.user._id)
    )
);

router.put(
    '/cart',
    UserAuth,
    handle((req) =>
        service.AddToCart(
            req.user._id,
            req.body.product || req.body,
            req.body.qty ?? req.body.unit
        )
    )
);

router.delete(
    '/cart/:id',
    UserAuth,
    handle((req) =>
        service.RemoveFromCart(
            req.user._id,
            req.params.id
        )
    )
);

router.post(
    '/internal/order',
    UserAuth,
    handle((req) =>
        service.PlaceOrder(
            req.user._id,
            req.body
        )
    )
);

module.exports = router;