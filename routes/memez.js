var express = require('express');
var router = express.Router();
var Meme = require("../models/memes");

router.get('/:id', function(req, res, next) {
    if (!req.params.id) {
        return res.status(400).end("Meme id not found")
    }

    Meme.findOne({
        key: req.params.id
    }, function(err, meme) {
        if (err) {
            return res.status(500).end("DB error");
        }

        res.render("meme/memeView",
            {
                title: meme.title,
                user: meme.uId,
                isCurrentUser: (meme.uId === req.session.userId),
                tags: meme.keywords,
                desc: meme.description,
                url: meme.mediaLink,
                logged_in: (req.session && req.session.userId)
            })
    })

});