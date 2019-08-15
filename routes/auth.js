var express = require('express');
var router = express.Router();
var User = require("../models/user");

router.get('/login', function(req, res, next){
    res.render('login', { title: 'Login'});
});

router.get('/signup', function(req, res, next) {
    res.render("signup", { title: 'Sign Up'});
});

router.post('/login', function(req, res, next){
    if (req.body.username && req.body.password) {
        User.authenticate(req.body.username, req.body.password, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong username or password.');
                err.status = 401;
                return res.send("Email or password wrong");
            } else {
                req.session.userId = user._id;
                return res.send("Authenticated")
            }
        });
    }

});

router.put('/signup', function(req, res, next) {

    // check that password and confirmPassword are the same
    if (req.body.password !== req.body.confirmPassword) {
        var err = new Error("Password and confirm password do not match");
        err.status = 400;
        res.send("Passwords don't match!");
        return next(err);
    }

    if (req.body.username && req.body.password && req.body.confirmPassword) {
        var uData = {
            username: req.body.username,
            password: req.body.password
        };

        var user = new User({
            username: uData.username,
            password: uData.password
        });
        user.save(function (err, obj) {
            if (err) {

                if (err.message.includes("duplicate")) {
                    return res.send("That user already exists!");
                }
                return console.error(err);
            }
            req.session.userId = obj._id;
            return res.send("Successfully signed up")
        });
    }
});

router.get('/logout', function(req, res, next) {
    if (req.session) {
        req.session.destroy(function(err) {
            if (err) {
                return res.send("Could not log out");
            } else {
                return res.redirect("/");
            }
        })
    }
});

module.exports = router;