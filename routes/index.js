var express = require('express');
var router = express.Router();

var database = require('../database');

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.user_id)
    {
        let fav_category ;
        database.query(`select * from user where email = '${req.session.user_id}'`, function(err,data){
            if(err){
                console.error(err);
            }
            else {
                console.log(data[0].fav_category);
                if(data[0].fav_category){
                    database.query(`select * from product where approved = 1 and category = '${data[0].fav_category}' limit 10;`, function (err, data) {
                        if (err) {
                            console.error(err);
                        } else

                            res.render('home', {products: data, session: req.session})

                    })
                }
                else {
                    database.query(`select * from product where approved = 1 limit 10;`, function (err, data) {
                        if (err) {
                            console.error(err);
                        } else

                            res.render('home', {products: data, session: req.session})

                    })
                }


            }
        })


    }
    else
    res.render('index', { title: 'Express', session : req.session});
});

router.post('/login', function(request, response, next){
    console.log(request.body)

    var user_email_address = request.body.user_email_address;

    var user_password = request.body.user_password;

    if(user_email_address && user_password)
    {
        query = `
        SELECT * FROM user
        WHERE email = "${user_email_address}"
        `;

        database.query(query, function(error, data){

            if(data.length > 0)
            {
                for(var count = 0; count < data.length; count++)
                {
                    if(data[count].pass === user_password)
                    {
                        request.session.user_id = data[count].email;
                        request.session.admin = data[count].admin;

                        response.redirect("/");
                    }
                    else
                    {
                        // response.send('Incorrect Password');
                        response.render('index', { message: 'Incorrect Password', session : request.session});
                    }
                }
            }
            else
            {
                // response.send('Incorrect Email Address');
                response.render('index', { message: 'Incorrect Email Address', session : request.session});
            }
            response.end();
        });
    }
    else
    {
        response.render('index', { message: 'Please Enter Email Address and Password Details', session : request.session});
        response.end();
    }

});

router.post('/register', function(request, response, next){

    var user_email_address = request.body.user_email_address;

    var user_password = request.body.user_password;
    var user_name = request.body.user_name;

    if(user_email_address && user_password)
    {
        query = `
        insert into user (email,pass,name,admin,blacklist) values ('${user_email_address}','${user_password}','${user_name}',FALSE,FALSE)
        `;

        database.query(query, function(error, data){
            if(error)
                console.log(error)
            else
            request.session.user_id = user_email_address;

            response.redirect("/");
            response.end();
        });
    }
    else
    {
        response.render('index', { message: 'Please Enter Name, Email Address and Password Details', session : request.session});
        response.end();
    }

});

router.get('/logout', function(request, response, next){

    request.session.destroy();

    response.redirect("/");

});

module.exports = router;

