const express = require('express');
const router = express.Router();
const cart = require('../models/CartModel')
const cartSanitizer = require('./helpers/cart-sanitizer');

function ensureCart(req) {
    if (req.session.cart == undefined)
        req.session.cart = cart.createCart();
}

// Ulančavanje funkcija međuopreme
router.get('/', cartSanitizer, function (req, res, next) {
    //prikaz košarice uz pomoć cart.ejs
    ensureCart(req);

    res.render('cart', {
        title: 'Cart',
        linkActive: 'cart',
        user: req.session.user,
        cart: req.session.cart,
        err: undefined,
    });
});

router.get('/add/:id', async function (req, res, next) {
    //dodavanje jednog artikla u košaricu
    ensureCart(req);

    await cart.addItemToCart(req.session.cart, req.params.id, 1);

    res.sendStatus(200);
});

router.get('/remove/:id', async function (req, res, next) {
    //brisanje jednog artikla iz košarice
    ensureCart(req);

    await cart.removeItemFromCart(req.session.cart, req.params.id, 1);

    res.sendStatus(200);
});

module.exports = router;