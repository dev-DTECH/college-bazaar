var express = require('express');
var router = express.Router();

var database = require('../database');

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.user_id && req.session.admin) {
        console.log(req.query)
        if (req.query) {
            if (req.query.approve === '1')
                database.query(`update product set approved = 1 where id = '${req.query.id}'`, function (err, data) {
                    if (err) {
                        console.error(err);
                    }
                })
            else
                database.query(`delete from product where id = '${req.query.id}'`, function (err, data) {
                    if (err) {
                        console.error(err);
                    }
                })
        }
        // if(req.url)
        database.query(`select * from product where approved = 0 limit 10;`, function (err, data) {
            if (err) {
                console.error(err);
            } else
                res.render('approve', {products: data})
        })

    } else
        res.render('index', {title: 'Express', session: req.session});
});

module.exports = router;