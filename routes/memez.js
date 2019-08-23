let express = require('express');
let router = express.Router();

let sanitizer = require("sanitizer");

let Meme = require("../models/memes");
let user = require("../models/user");
let karma = require("../models/fake_internet_points");
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
                        return res.status(500).end("DB error could not get user who posted it")
                    }

                    karma.find({memeKey: req.params.id})
                        .lean()
                        .then(function(karmas) {
                        let totalKarma = 0;
                        for (let i = 0; i < karmas.length; i++) {
                            totalKarma += karmas[i].amount;
                        }

                        // load karma since user is logged in
                        if (req.session && req.session.userId) {
                            karma.findOne({uId: req.session.userId, memeKey: meme.key})
                                .then(function(karmaDoc) {

                                    let change = 0;
                                    if (karmaDoc) {
                                        change = karmaDoc.amount;
                                    }

                                    return res.render("meme/memeView",
                                        {
                                            title: meme.title,
                                            user: user.username,
                                            isCurrentUser: (meme.uId === req.session.userId),
                                            tags: meme.keywords,
                                            desc: meme.description,
                                            url: meme.mediaLink,
                                            logged_in: (req.session && req.session.userId),
                                            key: meme.key,
                                            karma: totalKarma,
                                            userKarmaChange: change
                                        })
                                })
                                .catch(function(err) {
                                    res.status = 500;
                                    return next(err)
                                })
                        }

                        else {
                            return res.render("meme/memeView",
                                {
                                    title: meme.title,
                                    user: user.username,
                                    isCurrentUser: (meme.uId === req.session.userId),
                                    tags: meme.keywords,
                                    desc: meme.description,
                                    url: meme.mediaLink,
                                    logged_in: (req.session && req.session.userId),
                                    key: meme.key,
                                    karma: totalKarma,
                                })
                        }


                    })
                        .catch(function() {
                            return res.status(500).end("DB Error could not get karma for current post")
                        });


                })


            })
        .catch(function(e) {
            res.status = 500;
            return next(e);
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
   Meme.countDocuments().exec(function(err, count) {

       if (count === 0) {
           return res.redirect("/");
       }

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

router.get("/browse/:page", function (req, res, next) {
    if (isNaN(req.params.page)) {
        res.status = 400;
        return res.end("Page must be a number")
    }

    let page = req.params.page;
    if (page < 1 ){
        res.status = 400;
        return res.end("Page number must be greater than 1");
    }

    Meme.countDocuments().exec(function(err, docCount) {

        if (docCount === 0) {
            return res.redirect("/")
        }

        if (25 * (page - 1) >  docCount) {
            return res.redirect("/meme/browse/" + parseInt(page - 1));
        }

        Meme.find()
            .skip(25 * (page - 1))
            .limit(25)
            .lean()
            .then(function (docs) {
                docs.pop();
                return res.render("meme/browseMemes", {memes: docs, page: page, memeCount: docs.length, totalMemes: docCount})
            })
            .catch(function(err) {
                res.status = 500;
                return next(err);
            })
    });



});

router.put('/meme/:id/update', function(req, res, next) {
    Meme.findOne({key: req.params.id})
        .lean()
        .then(function(meme) {
            if (!meme) {
                return res.status(400).end("No meme with that key found");
            }

            if (req.body.newTitle && req.body.newTags && req.body.newDescription) {
                if (req.body.newTitle.length > 128) {
                    return res.status(400).end("Title is too long! Max 128 characters")
                }

                let title = sanitizer.sanitize(req.body.newTitle);
                let description = sanitizer.sanitize(req.body.newDescription);
                let updatedTags = req.body.newTags.split(',');

                if (req.body.newTags.length > 32) {
                    for (let i = 0; i < updatedTags.length; i++) {
                        if (updatedTags[i].length > 24) {
                            return res.status(400).send("Tag at position " + i + " ("+tagsArr[i]+")" + " is too long (max 24 chars)");
                        }

                        if (!updatedTags[i].match(/^[a-zA-Z0-9 ]*$/)) {
                            return res.status(400).send("Tag at position " + i + " ("+tagsArr[i]+")" + " is not alphanumeric");
                        }

                        updatedTags[i] = sanitizer.sanitize(tagsArr[i]);
                    }
                }

                meme.title = title;
                meme.description = description;
                meme.keywords = updatedTags;

                meme.save()
                    .then(function() {
                        return res.status(200).end("Successfully updated meme!");
                    })
                    .catch(function(err) {
                        return res.status(500).end("DB Error while updating meme")
                    })


            } else {
                return res.status(400).end("Does not contain all required fields");
            }
        })
});

module.exports = router;