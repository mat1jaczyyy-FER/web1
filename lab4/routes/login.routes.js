const express = require('express');
const router = express.Router();
const User = require('../models/UserModel')

function renderLogin(req, res, err) {
    res.render('login', {
        title: 'Login',
        linkActive: 'login',
        user: req.session.user,
        err: err
    })
}

router.get('/', function (req, res, next) {
    //vrati login stranicu
    renderLogin(req, res, undefined);
});

router.post('/', async function (req, res, next) {
    //postupak prijave korisnika
    var user = await User.fetchByUsername(req.body.user);

    if (user.id == undefined || !user.checkPassword(req.body.password)) {
        renderLogin(req, res, "User does not exist or incorrect password.");
        return;
    }

    //store u session i redirect
    req.session.user = user;
    res.redirect('/');
});


module.exports = router;