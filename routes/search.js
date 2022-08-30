const express = require('express');
const router = express.Router();

const db = require('../database');
router.get('/', function (req, res){
    console.log(req.query)
    if (req.session.user_id) {
        if(req.query.query){
            let sq= req.query.query.split(' ')

            let query = `select * from product where (approved = 1) and (`
            query+=`\`desc\` like '%${sq[0]}%' or name like '%${sq[0]}%' or category like '%${sq[0]}%'`;
            for (var i=1;i < sq.length; i++) {
                query+=` or \`desc\` like '%${sq[i]}%' or name like '%${sq[i]}%' or category like '%${sq[i]}%'`
            }
            query+=`)`
            console.log(query)
            let fav_category;
            db.query(query, function (err, data) {
                if (err) {
                    console.error(err);
                }
                console.log(data)

                res.render('search', {products: data, session: req.session})
                if(data[0]){
                    fav_category=data[0].category
                    console.log(data[0].category)
                    db.query(`update user set fav_category = '${data[0].category}' where email = '${req.session.user_id}'`, function (err, data) {
                        if (err) {
                            console.error(err);
                        }
                    })
                }
            })

        }
        else
        res.redirect('/')


    }
    else
    res.redirect('/')

})
module.exports = router;