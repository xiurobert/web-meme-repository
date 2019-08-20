function eHandler(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status = err.status || 500;
    var authed = false;
    if (req.session && req.session.userId) {
        authed = true;
    }
    res.render('error', { logged_in: authed, error_code: err.status });
}

module.exports = eHandler;