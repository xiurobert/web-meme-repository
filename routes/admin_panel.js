let express = require('express');
let router = express.Router();
let auth = require("../mw/requires_login").auth_check;
let admin_chk = require("../mw/requires_admin");

let memes = require("../models/memes");
let users = require("../models/user");


function adminMwStack(lvl) {
    return [auth, admin_chk(lvl)];
}


router.get('/', adminMwStack(1), function(req, res, next) {
    return res.render("admin/main");
});

router.get('/manage/memes', adminMwStack(3), function(req, res, next) {

    memes.find().lean().then(function(docs) {
        docs.pop();
        return res.render("admin/manage_memes", {memes: docs})
    });

});

router.get('/manage/users', adminMwStack(4), function (req, res, next) {
    users.find().lean().then(function(users) {
        return res.render("admin/manage_users", {users: users})
    })
});


router.delete('/manage/memes/:id/delete', adminMwStack(3), function(req, res, next) {
    memes.findOne({key: req.params.id})
        .lean()
        .then(function(meme) {
        if (!meme) {
            return res.status(400).send("Meme with that id not found");
        }

        memes.findByIdAndDelete(meme.id)
            .then(function() {
            return res.status(200).send("Meme successfully deleted");
        })
            .catch(function(e) {
                return res.status(500).send("DB error could not delete meme")
            })
    })
        .catch(function(e) {
            return res.status(500).send("DB error could not search for meme")
        })
});

// router.delete('/manage/users/:username/delete', adminMwStack(4), function(req, res, next) {
//     users.findOne({username: req.params.username})
//         .lean()
//         .then(function(user) {
//             if (!user) {
//                 return res.status(400).send("User with that username not found");
//             }
//
//             users.findByIdAndDelete(user.id)
//                 .then(function() {
//                     return res.status(200).send("User successfully deleted")
//                 })
//                 .catch(function(e) {
//                     return res.status(500).send("DB error could not delete user")
//                 })
//         })
// });

module.exports = router;