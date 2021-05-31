var express = require('express');
var router = express.Router();

var db = require('../db');

router.get('/', async function(req, res, next) {
    res.render('order', {
        title: 'Order',
        linkActive: 'order',
        categories: (await db.query("SELECT * FROM categories")).rows,
        inventory: (await db.query("SELECT * FROM inventory")).rows
    });
});

module.exports = router;