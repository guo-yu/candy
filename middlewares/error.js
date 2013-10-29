var errorRender = function(code, err, res) {
    res.status(500);
    res.render('error', {
        code: code,
        error: err
    });
}

var errorXhr = function(code, err, res) {
    res.json(code, {
        stat: 'error',
        error: err
    });
}

// choose a logger to save your errors
exports.logger = function(err, req, res, next) {
    console.log(err);
    next(err);
}

exports.xhr = function(err, req, res, next) {
    if (req.xhr) {
        errorXhr(500, err, res);
    } else {
        next(err);
    }
}

exports.common = function(err, req, res, next) {
    if (err.toString() == 'Error: 404') {
        exports.notfound(req, res, next);
    } else {
        errorRender(500, err, res);
    }
}

exports.notfound = function(req, res, next) {
    res.status(404);
    res.format({
        text: function() {
            res.send('404');
        },
        html: function() {
            errorRender(404, req.url, res);
        },
        json: function() {
            errorXhr(404, req.url, res);
        }
    });
}