var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//connect to MongoDB
mongoose.connect('mongodb://localhost/meme', {useNewUrlParser: true});
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var userZoneRouter = require('./routes/user_area');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true
}));


//use sessions for tracking logins
app.use(session({
    secret: 'dohdohdohdohdohdohdohdohdohdohdohdoh',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));


// serve static
app.use('/public', express.static(path.join(__dirname, 'public')));

// routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/z', userZoneRouter);

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
    var authed = false;
    if (req.session && req.session.userId) {
        authed = true;
    }
    res.render('error', { logged_in: authed, error_code: err.status });
});

module.exports = app;