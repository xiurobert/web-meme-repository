var express = require('express');
var router = express.Router();

router.get('/login', function(req, res, next){
    res.render('login', { title: 'Login'});
});

router.post('/login', function(req, res, next){
    // TODO logic when you post to login
});

router.get('/signup', function(req, res, next) {
    res.render("signup", { title: 'Sign Up'});
});

router.post('/signup', function(req, res, next) {
    // TODO logic when you post to signup
});

module.exports = router;