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
    user.findById(req.session.userId, function (err, user) {
        if (err) {
            res.send("500 Could not get user profile");
            next(err);
        }
        res.render('user_zone/my_profile',
            {
                "email": user.email,
                "username": user.username
            });
    });

});


module.exports = router;