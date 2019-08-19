var express = require('express');
var router = express.Router();
var Meme = require("../models/memes");
var user = require("../models/user");

router.get('/:id', function(req, res, next) {
    if (!req.params.id) {
        return res.status(400).end("Meme id is blank")
    }

    Meme.findOne({
        key: req.params.id
    }, function(err, meme) {
        if (err) {
            return res.status(500).end("DB error");
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
                    logged_in: (req.session && req.session.userId)
                })
        })


    })

});

router.get('/:memeId/delete', function(req, res, next) {

    if (!req.params.memeId) {
        return res.status(400).end("Meme id is blank")
    }
    Meme.findOne({
        key: req.params.memeId
    }, function(err, meme) {
        if (err) {
            return res.status(500).end("DB error");
        }

        if (!meme) {
            return res.status(404).end("That meme doesn't exist!");
        }

        if (meme.uId !== req.session.userId) {
            return res.status(403).end("As much as you hate the meme (or the user that submitted it) " +
                "you can't delete what is not yours")
        }

        Meme.deleteOne({key: req.params.memeId}, function(err) {
            if (err) {
                return res.status(500).end("DB error could not delete meme");
            }

            return res.status(200).end("Meme deleted successfully");
        })

    })
});

module.exports = router;