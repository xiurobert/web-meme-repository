let express = require('express');
let router = express.Router();
let karma = require("../models/fake_internet_points");
let meme = require("../models/memes");
let auth = require("../mw/requires_login").auth_check;

router.get('/:id/upvote', auth, function(req, res, next) {

    meme.findOne({key: req.params.id})
        .lean()
        .then(function(doc) {
            if (!doc) {
                return res.status(400).send("Bad input: No such meme");
            }
        })
        .catch(function(e) {
            return res.status(500).send("DB Error while locating meme");
        });

    karma.findOne({uId: req.session.userId, memeKey: req.params.id})
        .lean()
        .then(function(doc) {
        if (doc) {
            // If the user has already upvoted, make it remove the upvote (Delete the doc)
            if (doc.amount === 1) {
                karma.findOneAndDelete({uId: req.session.userId, memeKey: req.params.id})
                    .then(function() {
                        return res.status(200).send("Successfully removed the downvote");
                    })
                    .catch(function() {
                        return res.status(500).send("DB error while removing downvote");
                    })
            }
            // If the user has downvoted or hasn't upvoted, make it upvote
            if (doc.amount === -1 || doc.amount === 0) {

                karma.findOneAndUpdate({uId: req.session.userId, memeKey: req.params.id}, {amount: 1})
                    .then(function() {
                        return res.status(200).send("Successfully downvoted the post");
                    })
                    .catch(function() {
                        return res.status(500).send("DB error while downvoting the post");
                    });
            }

        }

        // User hasn't upvoted/downvoted before, create a new entry

        if (!doc) {
            let karmaChangeAction = new karma({
                uId: req.session.userId,
                memeKey: req.params.id,
                amount: 1
            });
            karmaChangeAction.save()
                .then(function() {
                    return res.status(200).send("Upvoted the post");
                })
                .catch(function() {
                    return res.status(500).send("DB error while making a new upvote");
                });

        }
    })
});

router.get('/:id/downvote', auth, function(req, res, next) {

    meme.findOne({key: req.params.id})
        .lean()
        .then(function(doc) {
            if (!doc) {
                return res.status(400).send("Bad input: No such meme");
            }
        })
        .catch(function(e) {
            return res.status(500).send("DB Error while locating meme");
        });

    karma.findOne({uId: req.session.userId, memeKey: req.params.id})
        .then(function(doc) {
            if (doc) {
                // If the user has already downvoted, make it remove the downvote (Delete the doc)
                if (doc.amount === -1) {
                    karma.findOneAndDelete({uId: req.session.userId, memeKey: req.params.id})
                        .then(function() {
                            return res.status(200).send("Successfully removed the downvote");
                        })
                        .catch(function() {
                            return res.status(500).send("DB error while removing downvote");
                        })
                }
                // If the user has upvoted or hasn't upvoted, make it downvote
                if (doc.amount === 1 || doc.amount === 0) {

                    karma.findOneAndUpdate({uId: req.session.userId, memeKey: req.params.id}, {amount: -1})
                        .then(function() {
                            return res.status(200).send("Successfully downvoted the post");
                        })
                        .catch(function() {
                            return res.status(500).send("DB error while downvoting the post");
                        });
                }
            }

            // User hasn't upvoted/downvoted before, create a new entry

            if (!doc) {
                let karmaChangeAction = new karma({
                    uId: req.session.userId,
                    memeKey: req.params.id,
                    amount: -1
                });
                karmaChangeAction.save()
                    .then(function() {
                        return res.status(200).send("Downvoted the post");
                    })
                    .catch(function() {
                        return res.status(500).send("DB error while making a new downvote");
                    });

            }
        })
});


module.exports = router;