let express = require('express');
let router = express.Router();
let auth = require("../mw/requires_login").auth_check;
let admin_chk = require("../mw/requires_admin");

let memes = require("../models/memes");
let users = require("../models/user");


function adminMwStack(lvl) {
    return [auth, admin_chk(lvl)];
}


router.get('/', adminMwStack(4), function(req, res, next) {
    return res.render("admin/main");
});

router.get('/manage/memes', adminMwStack(3), function(req, res, next) {

    memes.find().lean().then(function(docs) {
        docs.pop();
        return res.render("admin/manage_memes", {memes: docs})
    });

});

module.exports = router;