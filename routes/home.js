// index page
var async = require('async');

exports = module.exports = function($ctrlers) {

    var Thread = $ctrlers.thread;
    var fetchThreads = function(page, limit, query, callback) {
        var cursor = Thread.page(page, limit, query);
        cursor.query.populate('lz').populate('board').exec(function(err, threads) {
            callback(err, threads, cursor.pager);
        });
    };

    // PAGE: 首页
    return {
        index: function(req, res, next) {
            fetchThreads(1, 20, {}, function(err, threads, pager) {
                if (err) return next(err);
                res.render('index', {
                    threads: threads,
                    pager: pager
                });
            });
        },
        page: function(req, res, next) {
            if (!req.params.page) return next(new Error('404'));
            if (!isNaN(parseInt(req.params.page))) return next(new Error('404'));
            var page = parseInt(req.params.page, 10);
            fetchThreads(page, 20, {}, function(err, threads, pager) {
                if (err) return next(err);
                if (!threads) return next(new Error('404'));
                if (threads.length === 0) return next(new Error('404'));
                res.render('index', {
                    threads: threads,
                    pager: pager
                });
            });
        }
    }

}