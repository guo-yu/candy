// index page
var board = require('../ctrlers/board'),
    async = require('async'),
    _ = require('underscore');

var wash = function(count,boards) {
    var threads = [],
        count = {
            boards: count.boards ? count.boards: 3,
            threads: count.threads ? count.threads: 3
        }
    _.each(boards,function(b,bindex){
        if (bindex <= count.boards) {
            if (b.threads.length > 0) {
                _.each(b.threads,function(t,tindex){
                    if (tindex <= count.threads) {
                        threads.push(t);
                    }
                })
            }
        }
    });
    return threads;
}

module.exports = function(req, res) {
    async.waterfall([
        function(callback) {
            board.ls(function(boards) {
                callback(null, boards);
            })
        },
        function(boards, callback) {
            callback(null, boards, wash(boards));
        },
        function(boards,threads, callback) {
            res.render('index', {
                boards: boards,
                threads: threads
            })
        }
    ]);
};