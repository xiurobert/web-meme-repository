const ENV = "DEPRECATED";

let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let sassMiddleware = require('node-sass-middleware');
let mongoose = require('mongoose');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let Twig = require("twig");

let notFoundMw = require("./mw/404_mw");
let errorHandler = require("./mw/ehandler");


let indexRouter = require('./routes/index');
let authRouter = require('./routes/auth');
let userZoneRouter = require('./routes/user_area');
let memeRouter = require('./routes/memez');


let app = express();
if (ENV === "development" || app.get('env') === 'development') {
    Twig.cache(false);
    // disable caching in twig on dev
}
let config;
if (ENV === 'production' || app.get('env') === 'production') {
    config = require("./config.prod.json");
} else {
    config = require("./config.json");
}


const mango_conn = mongoose.connect(config.mongoUri,
    {useNewUrlParser: true, useFindAndModify: true, useCreateIndex: true});
let db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));


// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// application level middleware setup
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

module.exports = {"app": app, "mango": mango_conn, "env": ENV};