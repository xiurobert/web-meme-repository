var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    var loggedIn = false;
    if (req.session && req.session.userId) {
        loggedIn = true;
    }
    res.render('main/index', { title: 'ProgrammerHumor2', logged_in: loggedIn });
});

router.get('/about', function(req, res, next) {
    var loggedIn = false;
    if (req.session && req.session.userId) {
        loggedIn = true;
    }
    res.render('main/about', { logged_in: loggedIn});
});

module.exports = router;
