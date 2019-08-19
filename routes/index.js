var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    if (req.session && req.session.userId) {return res.redirect("/z/dash")}
    return res.redirect("/home")
});

router.get('/home', function(req, res, next) {
    res.render('main/index', { title: 'ProgrammerHumor2', logged_in: (req.session && req.session.userId) });
});

router.get('/about', function(req, res, next) {
    res.render('main/about', { logged_in: (req.session && req.session.userId)});
});

module.exports = router;
