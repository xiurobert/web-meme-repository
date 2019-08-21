let express = require('express');
let router = express.Router();
let auth = require("../mw/requires_login").auth_check;
let admin_chk = require("../mw/requires_admin");


function adminMwStack(lvl) {
    return [auth, admin_chk(lvl)];
}


router.get('/', adminMwStack(4), function(req, res, next) {

});