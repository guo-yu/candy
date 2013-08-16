exports.logger = function(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

exports.xhr = function(err, req, res, next) {
    if (req.xhr) {
        res.status(500);
        res.json({
            stat: 'error',
            error: err
        });
    } else {
        next(err);
    }
}

exports.common = function(err, req, res, next) {
    console.log(err);
    if (err == '404') {
        exports.notfound(req,res,next);
    } else {
        res.status(500);
        res.render('500', {
            error: err
        })
    }
}

exports.notfound = function(req, res, next) {
    res.status(404);
    if (req.accepts('html')) {
        res.render('404', {
            url: req.url
        });
    } else if (req.accepts('json')) {
        res.json({
            stat: '404',
            error: 'not found'
        })
    }
}