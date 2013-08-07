// admin ctrler
var config = require('../ctrlers/config'),
    user = require('../ctrlers/user'),
    board = require('../ctrlers/board'),
    thread = require('../ctrlers/thread'),
    async = require('async');

exports.read = function(cb) {
    async.waterfall([
        // read configs
        function(callback) {
            config.read(function(c){
                callback(null, c);                
            })
        },
        // read users
        function(c, callback) {
            user.ls(function(users){
                callback(null, c, users);
            })
        },
        // read boards
        function(c, users, callback) {
            board.ls(function(boards){
                callback(null, c, users, boards);
            })
        },
        function(c, users, boards, callback) {
            cb({
                config: c,
                users: users,
                boards: boards
            })
        }
    ]);
}

exports.update = function(setting,cb) {
    config.update(setting._id, setting, function(stat) {
        cb(stat);
    });
};