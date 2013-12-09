// index page
var async = require('async');

exports = module.exports = function($ctrlers) {

    var thread = $ctrlers.thread;
    var fetchThreads = function(page, limit, query, callback) {
        var cursor = threads.page(page, limit, query);
        cursor.query.populate('lz').populate('board').exec(function(err, threads) {
            callback(err, threads, cursor.pager);
        });
    }

    // PAGE: 首页
    return {
        index: function(req, res, next) {
            fetchThreads(1, 20, {}, function(err, threads, pager) {
                if (!err) {
                    res.render('index', {
                        threads: threads,
                        pager: pager
                    });
                } else {
                    next(err);
                }
            });
        },
        page: function(req, res, next) {
            if (req.params.page && !isNaN(parseInt(req.params.page), 10)) {
                var page = parseInt(req.params.page, 10);
                fetchThreads(page, 20, {}, function(err, threads, pager) {
                    if (!err) {
                        res.render('index', {
                            threads: threads,
                            pager: pager
                        });
                    } else {
                        next(err);
                    }
                });
            } else {
                next(new Error('404'));
            }
        }
    }

}