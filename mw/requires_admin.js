let usr = require("../models/user");

module.exports = function (lvl) {
    return function(req, res, next) {
        usr.findById(req.session.userId).lean().then(function(doc) {
            if (!doc) {
                let err = new Error("Not logged in");
                err.status = 403;
                return next(err);
            }
            if (doc.adminLevel <= lvl) {
                res.status = 403;
                return next();
            }
            return next();
        });
    }
};