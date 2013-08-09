// index page
var board = require('../ctrlers/board'),
    thread = require('../ctrlers/thread'),
    async = require('async'),
    _ = require('underscore');

// borads are id list
var wash = function(boards, params, callback) {
    var threads = [];
    var fetchThreads = function(b, cb) {
        thread.lsByBoardId(b, {
            limit: params.limit
        }, function(ts) {
            if (ts && ts.length > 0) {
                threads = threads.concat(ts);
            }
            cb();
        })
    };
    async.each(boards, fetchThreads, function(err) {
        if (!err) {
            callback(threads);
        }
    });
}

module.exports = function(req, res) {
    async.waterfall([
        function(callback) {
            board.lsId({
                limit: 10
            }, function(boards) {
                callback(null, boards);
            })
        },
        function(boards, callback) {
            wash(boards, {
                limit: 5
            }, function(threads) {
                callback(null, boards, threads)
            });
        },
        function(boards, threads, callback) {
            res.render('index', {
                boards: boards,
                threads: threads
            })
        }
    ]);
};