var express = require('express');
var router = express.Router();
var User = require("../models/user");

router.get('/login', function(req, res, next){
    res.render('login', { title: 'Login'});
});

router.post('/login', function(req, res, next){
    // TODO logic when you post to login
});

router.get('/signup', function(req, res, next) {
    res.render("signup", { title: 'Sign Up'});
});

router.put('/signup', function(req, res, next) {
    // TODO logic when you post to signup

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
            return res.send("Successfully signed up")
        });
    }
});

module.exports = router;