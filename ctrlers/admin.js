// admin ctrler
var config = require('../ctrlers/config'),
    user = require('../ctrlers/user'),
    board = require('../ctrlers/board'),
    async = require('async');

exports.read = function(cb) {
    async.waterfall([
        // read configs
        function(callback) {
            config.read(function(err,c){
                callback(err, c);                
            })
        },
        // read users
        function(c, callback) {
            user.list(function(err,users){
                callback(err, c, users);
            })
        },
        // read boards
        function(c, users, callback) {
            board.ls(function(err,boards){
                callback(err, c, users, boards);
            })
        }
    ], function (err, c, users, boards) {
        cb(err,{
            config: c,
            users: users,
            boards: boards
        })
    });
}

exports.update = function(setting, callback) {
    config.update(setting._id, setting, callback);
};