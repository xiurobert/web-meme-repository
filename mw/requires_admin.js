let usr = require("../models/user");

module.exports = function (lvl) {
    return function(req, res, next) {
        usr.findById(req.session.userId).lean().then(function(doc) {
            if (!doc) {
                var err = new Error("Not logged in");
                err.status = 403;
                return next(err);
            }
            if (usr.adminLevel !== lvl) {
                return next(new Error("Admin permissions insufficient").status(403));
            }
        });
    }
};