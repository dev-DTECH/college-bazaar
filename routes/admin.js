const express = require('express');
const router = express.Router();

const database = require('../database');

router.get('/', function (req, res, next) {
    if (req.session.user_id && req.session.admin) {
    res.render('admin',{session: req.session})
    }else
        res.end()
})
router.get('/approve', function (req, res, next) {
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
        database.query(`select * from product where approved = 0;`, function (err, data) {
            if (err) {
                console.error(err);
            } else
                res.render('admin', {mode: 'approve',products: data, session: req.session})
        })

    } else
        res.render('index', { title: 'Express', session: req.session});
})
router.get('/users', function (req, res, next) {
    if (req.session.user_id && req.session.admin) {
        console.log(req.query)
        if (req.query) {
            if (req.query.ban === '1')
                database.query(`update user set blacklist = 1 where email = '${req.query.id}'`, function (err, data) {
                    if (err) {
                        console.error(err);
                    }
                })
            else
                database.query(`update user set blacklist = 0 where email = '${req.query.id}'`, function (err, data) {
                    if (err) {
                        console.error(err);
                    }
                })
        }
        // if(req.url)
        database.query(`select * from user;`, function (err, data) {
            if (err) {
                console.error(err);
            } else
                res.render('admin', {mode: 'users',users: data, session: req.session})
        })

    } else
        res.render('index', {title: 'Express', session: req.session});
})
router.get('/products', function (req, res, next) {
    if (req.session.user_id && req.session.admin) {
        console.log(req.query)
        // if(req.url)
        database.query(`select * from product;`, function (err, data) {
            if (err) {
                console.error(err);
            } else
                res.render('admin', {mode: 'products',products: data, session: req.session})
        })

    } else
        res.render('index', {title: 'Express', session: req.session});
})

module.exports = router;