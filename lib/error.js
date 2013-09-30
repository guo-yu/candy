exports.logger = function(err, req, res, next) {
    // 记录到 forever.log 中
    console.log(err);
    next(err);
}

exports.xhr = function(err, req, res, next) {
    if (req.xhr) {
        res.json(500, {
            stat: 'error',
            error: err
        });
    } else {
        next(err);
    }
}

exports.common = function(err, req, res, next) {
    if (err.toString() == 'Error: 404') {
        exports.notfound(req, res, next);
    } else {
        res.status(500);
        res.render('500', {
            error: err
        })
    }
}

exports.notfound = function(req, res, next) {
    res.status(404);
    res.format({
        text: function() {
            res.send('404');
        },
        html: function() {
            res.render('404', {
                url: req.url
            });
        },
        json: function() {
            res.json({
                stat: '404',
                error: 'not found'
            })
        }
    });
}