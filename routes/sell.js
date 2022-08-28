var express = require('express');
var router = express.Router();
const  multer  =   require('multer');
const uuid = require('uuid')
const db = require('../database');
const database = require("../database");
const path = require("path");
/* GET users listing. */
router.get('/', function(req, res, next) {
    database.query(`select * from user where email ='${req.session.user_id}';`, function (err, data) {
        if (err) {
            console.error(err);
        } else
        {
            if(!data[0].blacklist)
                res.render('sell')
            else
                res.send("You are Blacklisted from selling")
        }

    })
});

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/product/img');
    },
    filename: function(req, file, cb) {
        cb(null, uuid.v4().replaceAll('-', ''))
    }
})
const upload = multer({ storage: storage });

router.post('/add',upload.single('product_image'),async (req, res) => {
    const product_name = req.body.product_name;
    const product_desc = req.body.product_desc;
    const product_price = req.body.product_price;
    const product_category = req.body.product_category;
    const product_id = req.file.filename
    if(product_name && product_desc){
        console.log(req.file)
        try {
            const newFile = await File.create({
                name: product_id,
            });
        } catch (error) {
        }
        db.query(`insert into product (name, \`desc\`, id,price,owner,category,approved) values ('${product_name}', '${product_desc}','${product_id}',${product_price},'${req.session.user_id}','${product_category}',false)`, function(error, data){
            if(error)
                console.log(error)
            res.redirect("/");
            res.end();
        });
    }
})

module.exports = router;
