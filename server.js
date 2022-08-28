const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const session = require('express-session');

const indexRouter = require('./routes/index');
const sellRouter = require('./routes/sell');
const adminRouter = require('./routes/admin');
const searchRouter = require('./routes/search');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(session({
    secret : 'webslesson',
    resave : true,
    saveUninitialized : true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/sell', sellRouter);
app.use('/search', searchRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
app.listen(PORT, h => {
    console.log(h)
    console.log(`Server Online -> http://localhost:${PORT}`);
});
