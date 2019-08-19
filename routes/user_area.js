var express = require('express');
var router = express.Router();
var user = require("../models/user");
var Meme = require("../models/memes");
var auth_mid = require("../mw/requires_login");
var crypto = require("crypto");

var main = require("../app");

var multer = require('multer');
var date = Date.now();
var GridFsStorage = require('multer-gridfs-storage')({
    url: 'mongodb://localhost:27017/meme',
    //db: main.mango,
    filename: function (req, file, cb) {

        cb(null, file.fieldname + '_' + date + '.');
    },

    metadata: function (req, file, cb) {
        cb(null, {originalFilename: file.originalname, mimetype: file.mimetype});
    },
    root: 'memeFiles'
});

var upload = multer({
    storage: GridFsStorage
});


router.get('/dash', auth_mid.auth_check, function(req, res, next) {
    res.render('user_zone/dash');
});

router.get('/submit', auth_mid.auth_check, function(req, res, next) {
    res.render('user_zone/submit');
});

router.get('/complete_submission', auth_mid.auth_check, function(req, res, next) {
    res.render('user_zone/submission_page', {
        "submission_title": req.query.title
    })
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

router.put('/submitMeme/:type', auth_mid.auth_check, function (req, res, next) {
    if (req.params.type === "link") {
        upload.none(function(req, res, next) {
            if (req.body.title && req.body.url) {

                // simple check to see if ur reposting URL
                Meme.findOne({mediaLink: req.body.url}, function (err, meme) {
                    if (err) {
                        next(err);
                    }
                    res.send("400 ur reposting");
                });

                var meme = new Meme({
                    key: crypto.createHash("sha256")
                        .update(req.body.title + time + req.body.url)
                        .digest("base64").substring(0, 6), // create 6 char unique key for each uploaded meme
                    uId: req.session.userId,
                        ...(req.body.tags && {tags: req.body.tags})

                })
            } else {
                res.send("400 No title and/or url")
            }
        });
    }
});


module.exports = router;