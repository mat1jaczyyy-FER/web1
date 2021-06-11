const express = require('express');
const router = express.Router();
const authHandler = require('./helpers/auth-handler');
const cart = require('../models/CartModel')
const cartSanitizer = require('./helpers/cart-sanitizer');

function ensureCart(req) {
    if (req.session.cart == undefined)
        req.session.cart = cart.createCart();
}

router.get('/', authHandler, cartSanitizer, function (req, res, next) {
    ensureCart(req);

    res.render('promotional', {
        title: 'Promotional',
        linkActive: 'cart',
        user: req.session.user,
        cart: req.session.cart,
        promo: req.session.promo,
        err: undefined,
    });
});

router.post('/save', authHandler, cartSanitizer, function (req, res, next) {
    req.session.promo = req.body;
    res.redirect("/cart");
});

router.post('/reset', authHandler, cartSanitizer, function (req, res, next) {
    delete req.session.promo;
    res.redirect("/promotional");
});

router.post('/order', authHandler, cartSanitizer, function (req, res, next) {
    delete req.session.promo;
    res.redirect("/checkout");
});

module.exports = router;