const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    //odjava korisnika
    delete req.session.user;
    delete req.session.cart;

    res.redirect('/');
});

module.exports = router;