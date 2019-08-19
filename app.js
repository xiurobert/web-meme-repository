var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var notFoundMw = require("./mw/404_mw");
var errorHandler = require("./mw/ehandler");


//connect to MongoDB
const mango_conn = mongoose.connect('mongodb://localhost/meme', {useNewUrlParser: true});
var db = mongoose.connection;



//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));


var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var userZoneRouter = require('./routes/user_area');
var memeRouter = require('./routes/memez');


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
app.use('/meme', memeRouter);

// Error handlers
app.use(notFoundMw);
app.use(errorHandler);

module.exports = {"app": app, "mango": mango_conn};