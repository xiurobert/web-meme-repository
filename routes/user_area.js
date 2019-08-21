var express = require('express');
var router = express.Router();
var user = require("../models/user");
var Meme = require("../models/memes");
var auth_mid = require("../mw/requires_login");
var crypto = require("crypto");
let validate = require("email-validator");
var sanitizer = require("sanitizer");
var base64url = require('base64url');

//var multer = require('multer');
var date = Date.now();
// var GridFsStorage = require('multer-gridfs-storage')({
//     url: 'mongodb://localhost:27017/meme',
//     //db: main.mango,
//     filename: function (req, file, cb) {
//
//         cb(null, file.fieldname + '_' + date + '.');
//     },
//
//     metadata: function (req, file, cb) {
//         cb(null, {originalFilename: file.originalname, mimetype: file.mimetype});
//     },
//     root: 'memeFiles'
// });
//
// var upload = multer({
//     storage: GridFsStorage
// });


router.get('/dash', auth_mid.auth_check, function(req, res, next) {
    Meme.find({
        uId: req.session.userId
    }, function(err, obj) {
        if (err) {
            return next(err);
        }
        obj.pop();
        res.render('user_zone/dash', {memes: obj});
    });


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

router.get('/my_submissions', auth_mid.auth_check, function(req, res, next) {
    Meme.find({
        uId: req.session.userId
    }, function(err, obj) {
        if (err) {
            return next(err);
        }
        res.render('user_zone/my_submissions', {memes: obj});
    });

});

router.put('/my_profile/update', auth_mid.auth_check, function(req, res, next) {

    if (req.body.email && req.body.username) {

        if (!validate.validate(req.body.email)) {
            return res.status(400).end("Email is invalid!");
        }

        user.findByIdAndUpdate(req.session.userId,
            {email: req.body.email, username: sanitizer.sanitize(req.body.username)}).then(function(usr) {
                return res.status(200).send("update successful");
        }).catch(function(err) {
            res.status = 500;
            return res.send("Could not get user profile")
        })
    }
});

// router.put('/submitMeme/:type', auth_mid.auth_check, function (req, res, next) {
//     if (req.params.type === "link") {
//         upload.none(function(req, res, next) {
//             if (req.body.title && req.body.url) {
//
//                 // simple check to see if ur reposting URL
//                 Meme.findOne({mediaLink: req.body.url}, function (err, meme) {
//                     if (err) {
//                         next(err);
//                     }
//                     res.send("400 ur reposting");
//                 });
//
//                 var meme = new Meme({
//                     key: crypto.createHash("sha256")
//                         .update(req.body.title + date + req.body.url)
//                         .digest("base64").substring(0, 6), // create 6 char unique key for each uploaded meme
//                     uId: req.session.userId,
//                     ...(req.body.tags && {keywords: req.body.tags}),
//                     ...(req.body.desc && {description: req.body.desc}),
//                     memeFormat: "url",
//                     mediaLink: req.body.url
//
//                 });
//
//                 meme.save(function(err, obj) {
//                     if (err) {
//                         next(err);
//                     }
//                 });
//                 res.send("200 Meme inserted (URL)");
//             } else {
//                 res.send("400 No title and/or url")
//             }
//         });
//     } else if (req.params.type === "file") {
//         upload.single("meme_upload", function(req, res, next) {
//             if (req.body.title && req.file) {
//                 var meme = new Meme({
//                     key: crypto.createHash("sha256")
//                         .update(req.body.title + date + req.body.file.filename)
//                         .digest("base64").substring(0, 6),
//                     uId: req.session.userId,
//                     ...(req.body.tags && {keywords: req.body.tags}),
//                     ...(req.body.desc && {description: req.body.desc}),
//                     memeFormat: "file",
//                     mediaGridFsId: req.file.id
//                 });
//
//                 meme.save(function(err, obj) {
//                     if (err) {
//                         next(err);
//                     }
//                 });
//                 res.send("200 Meme inserted (File)")
//             } else {
//                 res.send("400 No title and/or file")
//             }
//
//         })
//     } else {
//         res.send("400 Invalid MEMEtype")
//     }
// });

router.put("/submitMemeLink", auth_mid.auth_check, function(req, res, next) {
    if (req.body.title && req.body.url) {

        if (req.body.title.length > 128) {
            return res.status(400).send("Your title is too long. Max 128 chars.");
        }

        if (req.body.tags) {
            tagsArr = req.body.tags.split(",");

            if (tagsArr.length > 32) {
                return res.status(400).send("You have too many tags ("+tagsArr.length+"). Max: 32");
            }

            for (let i = 0; i < tagsArr.length; i++) {
                if (tagsArr[i].length > 24) {
                    return res.status(400).send("Tag at position " + i + " ("+tagsArr[i]+")" + " is too long (max 24 chars)");
                }

                if (!tagsArr[i].match(/^[a-zA-Z0-9 ]*$/)) {
                    return res.status(400).send("Tag at position " + i + " ("+tagsArr[i]+")" + " is not alphanumeric");
                }

                tagsArr[i] = sanitizer.sanitize(tagsArr[i]);
            }
        }

        if (req.body.url.includes("base64")) {
            return res.status(400).send("Base64 images are disallowed");
        }



        var meme = new Meme({
            title: sanitizer.sanitize(req.body.title),
            key: base64url(req.body.title + date + req.body.url + Math.random()).substring(0, 6), // create 6 char unique key for each uploaded meme
            uId: req.session.userId,
            ...(req.body.tags && {keywords: tagsArr}),
            ...(req.body.desc && {description: sanitizer.sanitize(req.body.desc)}),
            memeFormat: "url",
            mediaLink: sanitizer.sanitize(req.body.url)

        });

        meme.save(function(err, obj) {
            if (err) {
                return res.status(500).send("Error saving meme");
            } else {
                return res.status(200).end("200 Meme added (Link),"+obj.key)
            }

        })
    } else {
        return res.status(400).end("400 No title and/or url");
    }
});


module.exports = router;