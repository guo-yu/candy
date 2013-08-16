// index page
var board = require('../ctrlers/board'),
    thread = require('../ctrlers/thread'),
    async = require('async');

// borads are id list
var wash = function(boards, params, callback) {
    var threads = [];
    var fetchThreads = function(b, cb) {
        thread.lsByBoardId(b, {
            limit: params.limit
        }, function(err, ts) {
            if (!err) {
                if (ts && ts.length > 0) {
                    threads = threads.concat(ts);
                }
                cb();
            } else {
                cb(err)
            }
        })
    };
    async.each(boards, fetchThreads, function(err) {
        if (!err) {
            callback(null, threads);
        } else {
            callback(err)
        }
    });
}

// PAGE: 首页
module.exports = function(req, res, next) {
    async.waterfall([
        function(callback) {
            board.lsId({
                limit: 10
            }, function(err, boards) {
                callback(err, boards);
            })
        },
        function(boards, callback) {
            wash(boards, {
                limit: 5
            }, function(err, threads) {
                callback(err, boards, threads)
            });
        }
    ],function(err, boards, threads){
        if (!err) {
            res.render('index', {
                boards: boards,
                threads: threads
            });
        } else {
            next(err);
        }
    });
};