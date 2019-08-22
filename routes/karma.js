let express = require('express');
let router = express.Router();
let karma = require("../models/fake_internet_points");
let meme = require("../models/memes");
let auth = require("../mw/requires_login").auth_check;

router.get('/:id/upvote', auth, function(req, res, next) {
    karma.findOne({uId: req.session.userId, memeKey: req.params.id})
        .then(function(doc) {
        if (doc) {
            if (doc.amount === 1) {
                karma.findOneAndDelete({})
            }
        }
    })
});

module.exports = router;