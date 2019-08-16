var express = require('express');
var router = express.Router();
var auth_mid = require("../mw/requires_login");

router.get('/dash', auth_mid.auth_check, function(req, res, next) {
    res.render('user_zone/dash');
});

router.get('/submit', auth_mid.auth_check, function(req, res, next) {
    res.render('user_zone/submit');
});


module.exports = router;