var express = require('express');
var router = express.Router();
var User = require("../models/user");
var validator = require("email-validator");
var sanitizer = require("sanitizer");

router.get('/login', function(req, res, next){
    res.render('auth/login', { title: 'Login'});
});

router.get('/signup', function(req, res, next) {
    res.render("auth/signup", { title: 'Sign Up'});
});

router.post('/login', function(req, res, next){
    if (req.body.username && req.body.password) {
        User.authenticate(req.body.username, req.body.password, function (error, user) {
            if (error || !user) {
                return res.status(401).send("Wrong username/email or password wrong");
            } else {
                req.session.userId = user._id;
                return res.send("Authenticated")
            }
        });
    }

});

router.put('/signup', function(req, res, next) {

    if (req.body.email && req.body.username && req.body.password && req.body.confirmPassword) {

        // check that email is right format
        if (!validator.validate(req.body.email)) {
            var err = new Error("Email format is invalid");
            err.status = 400;
            res.send("Email format is invalid!");
            return next(err)
        }
        // check that password and confirmPassword are the same
        if (req.body.password !== req.body.confirmPassword) {
            var err1 = new Error("Password and confirm password do not match");
            err1.status = 400;
            res.send("Passwords don't match!");
            return next(err1);
        }

        if (req.body.username.length > 64) {
            return res.status(400).send("Maximum length of username is 64 characters");
        }

        if (req.body.username.search(/^[a-zA-Z0-9-_]+$/) === -1) {
            return res.status(400)
                .send("Username can only contain alphanumerical characters, _ or - ");
        }
        var uData = {
            email: req.body.email,
            username: sanitizer.sanitize(req.body.username),
            password: sanitizer.sanitize(req.body.password)
        };

        var user = new User({
            email: uData.email,
            username: uData.username,
            password: uData.password
        });
        user.save(function (err, obj) {
            if (err) {

                if (err.message.includes("duplicate")) {
                    return res.status(400).send("That user already exists!");
                }
                return console.error(err);
            }
            req.session.userId = obj._id;
            return res.status(200).end("Successfully signed up")
        });
    }
});

router.get('/logout', function(req, res, next) {
    if (req.session) {
        req.session.destroy(function(err) {
            if (err) {
                return res.status(500).end("Could not log out");
            } else {
                return res.redirect("/");
            }
        })
    }
});

module.exports = router;