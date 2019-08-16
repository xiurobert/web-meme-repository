var express = require('express');
var router = express.Router();
var user = require("../models/user");
var auth_mid = require("../mw/requires_login");

router.get('/dash', auth_mid.auth_check, function(req, res, next) {
    res.render('user_zone/dash');
});

router.get('/submit', auth_mid.auth_check, function(req, res, next) {
    res.render('user_zone/submit');
});

router.get('/my_profile', auth_mid.auth_check, function(req, res, next) {
    var u = user.findById(req.session.userId);
    res.render('user_zone/my_profile',
        {
            "email": u.email,
            "username": u.username
        })
});


module.exports = router;