// index page
var board = require('../ctrlers/board'),
    async = require('async');

module.exports = function(req, res) {
    async.waterfall([
        function(callback) {
            board.ls(function(boards) {
                callback(null, boards);
            })
        },
        function(boards, callback) {
            res.render('index', {
                boards: boards
            })
        }
    ]);
};