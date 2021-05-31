var express = require('express');
var router = express.Router();

var db = require('../db');

async function getItem(id) {
    var item = (await db.query(`SELECT * FROM inventory WHERE id = ${id}`)).rows[0];

    return {
        linkActive: 'order',
        item: item
    }
}

router.get('/:id', async function(req, res, next) {
    var options = await getItem(req.params.id);
    options.title = options.item.name;
    options.category = (await db.query(`SELECT * FROM categories WHERE id = ${options.item.categoryid}`)).rows[0];
    options.suppliers = (await db.query(`SELECT * FROM suppliers WHERE supplierfor = ${options.item.id}`)).rows;

    res.render('item', options);
});

router.get('/:id/:action', async function(req, res, next) {
    if (req.params.action != "addsupplier") return;
    
    var options = await getItem(req.params.id);
    options.title = 'Add Supplier';

    res.render('addsupplier', options);
});

function validate(i) {
    errors = []

    i.name = i.name.trim();

    if (i.name.length < 3 || 25 < i.name.length)
        errors.push("name");
    
    i.country = i.country.trim();

    if (i.country.length < 3 || 25 < i.country.length)
        errors.push("country");
    
    i.county = i.county.trim();

    if (i.county.length < 3 || 25 < i.county.length)
        errors.push("county");

    i.email = i.email.trim();
    var at = i.email.indexOf("@");
    var dot = i.email.substring(at + 1).indexOf(".");

    if (at <= 0 || dot <= 0 || i.email.length <= at + dot + 2)
        errors.push("email");

    i.suppliersince = i.suppliersince.trim();

    if (!(1940 <= i.suppliersince && i.suppliersince <= 2021))
        errors.push("suppliersince");
    
    return errors;
}

router.post('/:id/:action', async function(req, res, next) {
    if (req.params.action != "addsupplier") return;

    var errors = validate(req.body);

    if (errors.length == 0) {
        try {
            await db.query(
                `INSERT INTO suppliers (name, country, county, email, suppliersince, supplierfor, asd) ` +
                `VALUES ('${req.body.name}', '${req.body.country}', '${req.body.county}', '${req.body.email}', ${req.body.suppliersince}, ${req.params.id})`
            );
        } catch (ex) {
            res.render('error', {
                title: 'Add Supplier',
                linkActive: 'order',
                errors: 'none',
                errDB: ex.message,
                itemID: req.params.id
            });
            return;
        }
        
        res.redirect(`/item/${req.params.id}`);

    } else {
        res.render('error', {
            title: 'Add Supplier',
            linkActive: 'order',
            errors: errors.map(i => { return {msg: 'Invalid value', param: i}}),
            itemID: req.params.id
        });
    }
});

module.exports = router;
