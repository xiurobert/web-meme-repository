function requires_auth(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error("Not authenticated");
        err.status = 403;
        return res.redirect("/");
    }
}

module.exports.auth_check = requires_auth;