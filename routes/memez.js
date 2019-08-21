let express = require('express');
let router = express.Router();

let sanitizer = require("sanitizer");

let Meme = require("../models/memes");
let user = require("../models/user");
let auth_mid = require("../mw/requires_login");

router.get('/:id', function(req, res, next) {
    if (!req.params.id) {
        return res.status(400).end("Meme id is blank")
    }

    Meme.findOne({key: req.params.id})
        .lean()
        .then(
            function(meme) {
                if (!meme) {
                    return next();
                }

                user.findById(meme.uId, function(err, user) {

                    if (err) {
                        return res.status(500).end("DB error 2")
                    }

                    res.render("meme/memeView",
                        {
                            title: meme.title,
                            user: user.username,
                            isCurrentUser: (meme.uId === req.session.userId),
                            tags: meme.keywords,
                            desc: meme.description,
                            url: meme.mediaLink,
                            logged_in: (req.session && req.session.userId),
                            key: meme.key
                        })
                })


            })

});

router.get('/:memeId/delete', auth_mid.auth_check, function(req, res, next) {

    if (!req.params.memeId) {
        return res.status(400).end("Meme id is blank")
    }
    Meme.findOne({key: req.params.memeId})
        .lean()
        .then(
            function(meme) {
                if (!meme) {
                    return res.status(404).end("That meme doesn't exist!");
                }

                if (meme.uId !== req.session.userId) {
                    return res.status(403).end("As much as you hate the meme (or the user that submitted it) " +
                        "you can't delete what is not yours")
                }

                Meme.deleteOne({key: req.params.memeId})
                    .then(function() {
                        return res.status(200).end("Meme deleted successfully");
                    })
                    .catch(function() {
                        return res.status(500).end("DB error could not delete meme");
                    })

            }
        )
        .catch(
            function() {
                return res.status(500).end("DB error");
            }
        )
});

router.get('/:memeId/update', auth_mid.auth_check, function(req, res, next) {

    if (!req.params.memeId) {
        return res.status(400).end("Meme id is blank")
    }


    Meme.findOne({key: req.params.memeId})
        .lean()
        .then(function(meme) {


            if (!meme) {
                return res.status(404).end("That meme doesn't exist!");
            }

            if (meme.uId !== req.session.userId) {
                return res.status(403).end("As much as you hate this meme or its user you can't edit what is not yours")
            }

            return res.render("meme/editMeme", {meme: meme})

        }).catch(function() {
        return res.status(500).end("DB error");

    });

});

router.get("/search", function(req, res, next) {
    if (!req.query.q) {
        res.status = 400;
        return next();
    }

    Meme.find(
        {$or: [
                {$text: {$search: new RegExp("/" + req.query.q + "/")}},
                {keywords: new RegExp("/" + req.query.q + "/")}
            ]})
        .limit(25)
        .lean()
        .then(function(docs) {
            let queryExecTime = docs.pop().execTime;
            res.render("meme/searchEngine",
                {
                    memes: docs,
                    logged_in: (req.session && req.session.userId),
                    searchTime: queryExecTime
                })
        })
        .catch(function(err) {
            res.status = 500;
            return next(err);
        })
});

router.get("/random", function(req, res, next) {
   Meme.count().exec(function(err, count) {
       if (err) {
           res.status = 500;
           return next(err);
       }
       Meme.findOne()
           .skip(Math.floor(Math.random() * count))
           .exec(function(err, doc) {
               if (err) {
                   res.status = 500;
                   return next(err);
               }

               return res.redirect("/meme/" + doc.key);
           })
   })
});

module.exports = router;